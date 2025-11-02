const { MongoClient, ServerApiVersion } = require('mongodb');

// NOTE: password contains an '@' so it must be URL-encoded as %40
const username = 'user-1';
const password = 'jesus%40123'; // jesus@123 -> jesus%40123
const uri = `mongodb+srv://${username}:${password}@cluster0.d4vucth.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log('Attempting to connect to MongoDB with URI:');
    console.log(uri.replace(password, '***')); // hide password in logs

    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (err) {
    console.error('Connection failed:', err && err.message ? err.message : err);
  } finally {
    try {
      await client.close();
    } catch (closeErr) {
      // ignore
    }
  }
}

run().catch((e) => console.error('Unexpected error:', e));

REACT_APP_API_URL=http://localhost:5000/api
