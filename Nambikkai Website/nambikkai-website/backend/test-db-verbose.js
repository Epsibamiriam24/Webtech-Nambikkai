const mongoose = require('mongoose');
require('dotenv').config();

console.log('Starting MongoDB Atlas connection test...');
console.log('Node version:', process.version);
console.log('Mongoose version:', mongoose.version);

// Extract database name from URI or use default
const uri = process.env.MONGODB_URI;
const dbName = 'nambikkai';

async function testConnection() {
    try {
        console.log('\nAttempting to connect with URI (password hidden):');
        console.log(uri.replace(/:([^:@]{8,}?)@/, ':****@'));
        
        const connection = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: dbName,
            connectTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000,  // 45 seconds
            serverSelectionTimeoutMS: 10000, // 10 seconds
        });

        console.log('\n✅ Successfully connected to MongoDB Atlas!');
        console.log('Database:', connection.connection.db.databaseName);
        console.log('Host:', connection.connection.host);
        
        // Test a basic database operation
        const adminDb = connection.connection.db;
        const ping = await adminDb.admin().ping();
        console.log('\n✅ Database ping successful:', ping);
        
        // Get server info
        const serverStatus = await adminDb.admin().serverStatus();
        console.log('\nServer Info:');
        console.log('- Version:', serverStatus.version);
        console.log('- Uptime:', Math.floor(serverStatus.uptime / 86400), 'days');
        
        return true;
    } catch (error) {
        console.error('\n❌ MongoDB connection error:');
        console.error('- Message:', error.message);
        if (error.name) console.error('- Type:', error.name);
        if (error.code) console.error('- Code:', error.code);
        
        // Network diagnostics
        console.log('\n🔍 Running network diagnostics...');
        try {
            const { exec } = require('child_process');
            exec('nslookup cluster0.d4vucth.mongodb.net', (err, stdout, stderr) => {
                if (err) {
                    console.log('DNS Lookup failed:', err);
                    return;
                }
                console.log('\nDNS Resolution:');
                console.log(stdout);
            });
        } catch (diagError) {
            console.error('Diagnostics failed:', diagError);
        }
        
        return false;
    } finally {
        try {
            await mongoose.disconnect();
            console.log('\nClosed MongoDB connection');
        } catch (e) {
            // Ignore disconnect errors
        }
    }
}

// Run the test
testConnection()
    .then(success => {
        if (!success) {
            console.log('\n🔧 Troubleshooting steps:');
            console.log('1. Verify your IP in MongoDB Atlas Network Access:');
            console.log('   - Go to: https://cloud.mongodb.com');
            console.log('   - Network Access → IP Access List');
            console.log('   - Add your IP: 14.139.187.145/32');
            console.log('   - Or temporarily allow all: 0.0.0.0/0\n');
            console.log('2. Check your connection:');
            console.log('   - Try a different network (e.g., mobile hotspot)');
            console.log('   - Check if port 27017 is blocked by firewall\n');
            console.log('3. Verify MongoDB URI:');
            console.log('   - Check username and password');
            console.log('   - Ensure cluster name is correct\n');
        }
        process.exit(success ? 0 : 1);
    })
    .catch(err => {
        console.error('Test failed:', err);
        process.exit(1);
    });