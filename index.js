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
        const cartCollections = client.db('cartDB').collection('cart');

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
        });



        app.post('/brands', async (req, res) => {
            const brands = req.body;
            const result = await brandsCollections.insertOne(brands);
            res.send(result)
        });

        app.post('/cart', async (req, res) => {
            const cart = req.body;
            const result = await cartCollections.insertOne(cart);
            res.send(result);

        })

        app.put('/brands/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDetails = req.body;
            const details = {
                $set: {
                    brandName: updateDetails.brandName, description: updateDetails.description, photo: updateDetails.photo,
                    price: updateDetails.price,
                    productName: updateDetails.productName, rating: updateDetails.rating,
                    type: updateDetails.type,
                }
            }
            const result = await brandsCollections.updateOne(filter, details, options);
            res.send(result);
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