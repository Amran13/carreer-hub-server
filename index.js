const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.CARREER_DB}:${process.env.CARREER_PASS}@cluster0.0sxdnca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const applicationCollections = client.db('carreerDB').collection('ApplicationDB');

    app.get('/applications', async(req, res) => {
        const cursor = applicationCollections.find()
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/applications', async(req, res) => {
        const newApplication = req.body;
        const result = await applicationCollections.insertOne(newApplication)
        res.send(result)
    })

    app.delete('/applications/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await applicationCollections.deleteOne(query)
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
