const { MongoClient, ServerApiVersion } = require('mongodb');

// Using native driver to test direct connection
async function testConnection() {
    const username = 'user-1';
    const password = 'jesus%40123';
    const uri = `mongodb+srv://${username}:${password}@cluster0.d4vucth.mongodb.net/?appName=Cluster0`;
    
    console.log('Testing connection with URI (password hidden):');
    console.log(uri.replace(password, '****'));
    
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        connectTimeoutMS: 30000,  // 30 seconds
        socketTimeoutMS: 45000,   // 45 seconds
    });

    try {
        await client.connect();
        console.log('✅ Connected successfully to MongoDB Atlas!');
        
        // Test basic operation
        const adminDb = client.db("admin");
        const ping = await adminDb.command({ ping: 1 });
        console.log("✅ Pinged deployment. MongoDB is responsive:", ping);
        
        return true;
    } catch (err) {
        console.error('❌ Connection error:', err.message);
        if (err.code) console.error('Error code:', err.code);
        return false;
    } finally {
        await client.close();
        console.log('Closed connection');
    }
}

// Run test and show network info
async function runDiagnostics() {
    console.log('🔍 Running connection test...\n');
    
    const success = await testConnection();
    
    if (!success) {
        console.log('\n📡 Network Diagnostics:');
        const { exec } = require('child_process');
        
        // Test DNS resolution
        console.log('\nTesting DNS resolution...');
        exec('nslookup cluster0.d4vucth.mongodb.net', (err, stdout) => {
            console.log(stdout);
            
            // Test TCP connection
            console.log('\nTesting TCP connection to MongoDB port...');
            exec('Test-NetConnection -ComputerName cluster0.d4vucth.mongodb.net -Port 27017', (err, stdout) => {
                console.log(stdout);
            });
        });
    }
}

runDiagnostics().catch(console.error);