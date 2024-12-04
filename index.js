const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middlewere
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oh0s98i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();  //comment this line before deploy in varcel

        //collections
        const coffeeCollection = client.db("coffeeDB").collection("coffee");
        const userCollection = client.db("coffeeDB").collection("users");


        //Post coffee
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee)
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
        })

        //get coffee
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        //get specific coffee
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        // update specific coffee
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    quantity: updatedCoffee.quantity,
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste,
                    category: updatedCoffee.category,
                    details: updatedCoffee.name,
                    photo: updatedCoffee.photo
                },
            };
            const result = await coffeeCollection.updateOne(filter, coffee, options)
            res.send(result);
        })

        //delete coffee
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })


        //user related API's
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        //get users
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        //get specified user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.findOne(query)
            res.send(result)
        })

        // update specific user
        app.patch('/users', async (req, res) => {
            const user = req.body;
            const filter={email: user.email };
            const updatedUser={
                $set:{
                    lastLogInTime: user.lastLogInTime
                }
            }
          const result =await userCollection.updateOne(filter,updatedUser)
          res.send(result)
        })

        //delete specified user
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });  //comment this line before deploy in varcel
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Coffee Store server is running')
})

app.listen(port, () => {
    console.log(`Coffee Store server is running on port: ${port}`)
})