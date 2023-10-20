const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cy95lx0.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const brandsCollections = client.db('brandsDB').collection('brands');

        app.get('/brands', async (req, res) => {
            const cursor = brandsCollections.find();
            const result = await cursor.toArray();
            res.send(result)
        });

        app.get('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await brandsCollections.findOne(query);
            res.send(result)
        })

        app.post('/brands', async (req, res) => {
            const brands = req.body;
            const result = await brandsCollections.insertOne(brands);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running')
});

app.listen(port, () => {
    console.log(`server is running ${port}`);
})