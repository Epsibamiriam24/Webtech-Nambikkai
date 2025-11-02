const mongoose = require('mongoose');
const dns = require('dns');
const { promisify } = require('util');
const { exec } = require('child_process');
require('dotenv').config();

const resolveSrv = promisify(dns.resolveSrv);
const lookup = promisify(dns.lookup);

async function testMongoConnection() {
    console.log('🔍 Starting MongoDB Atlas Connection Diagnostics\n');

    // 1. Check MongoDB URI
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found in environment variables');
        return;
    }
    console.log('MongoDB URI format check:', uri.startsWith('mongodb+srv://') ? '✅ Valid' : '❌ Invalid');
    
    // 2. Extract hostname from URI
    const hostname = uri.split('@')[1].split('/')[0];
    console.log('\n📡 Testing connection to:', hostname);

    // 3. DNS Resolution Test
    try {
        console.log('\nResolving SRV records...');
        const srvRecords = await resolveSrv(`_mongodb._tcp.${hostname}`);
        console.log('✅ SRV records found:', srvRecords.length);
        
        for (const record of srvRecords) {
            console.log(`- Host: ${record.name}, Port: ${record.port}`);
            try {
                const address = await lookup(record.name);
                console.log(`  IP: ${address.address}`);
                
                // Test TCP connection
                console.log('  Testing TCP connection...');
                await new Promise((resolve) => {
                    exec(`Test-NetConnection -ComputerName ${record.name} -Port ${record.port}`, (err, stdout) => {
                        console.log(`  ${stdout.includes('TcpTestSucceeded : True') ? '✅' : '❌'} TCP Test:`, stdout.trim());
                        resolve();
                    });
                });
            } catch (e) {
                console.log(`  ❌ DNS lookup failed:`, e.message);
            }
        }
    } catch (e) {
        console.error('❌ DNS resolution failed:', e.message);
    }

    // 4. Mongoose Connection Test
    console.log('\n🔌 Testing Mongoose connection...');
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000,
            heartbeatFrequencyMS: 2000,
        });
        console.log('✅ MongoDB connected successfully!');
        
        // Test database operation
        const adminDb = mongoose.connection.db.admin();
        const result = await adminDb.ping();
        console.log('✅ Database ping successful:', result);
        
    } catch (err) {
        console.error('❌ MongoDB connection failed');
        console.error('Error:', err.message);
        
        if (err.name === 'MongooseServerSelectionError') {
            console.log('\n🔍 Server Selection Error Details:');
            if (err.reason && err.reason.servers) {
                console.log('Attempted connections to:');
                err.reason.servers.forEach((desc, host) => {
                    console.log(`- ${host}: ${desc.type}`);
                });
            }
        }
    } finally {
        try {
            await mongoose.disconnect();
            console.log('\nClosed MongoDB connection');
        } catch (e) {
            // Ignore disconnect errors
        }
    }
}

// Run tests
console.log('🚀 Starting connection tests...\n');
testMongoConnection()
    .then(() => {
        console.log('\n📋 Troubleshooting Summary:');
        console.log('1. Check if IP 14.139.187.145/32 is in MongoDB Atlas Network Access');
        console.log('2. Try connecting from a different network (mobile hotspot)');
        console.log('3. Check if port 27017 is blocked by your network');
        process.exit(0);
    })
    .catch(err => {
        console.error('Test failed:', err);
        process.exit(1);
    });