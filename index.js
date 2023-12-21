const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

// Midddlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xurchnw.mongodb.net/?retryWrites=true&w=majority`;

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
    // collections
    const taskCollection = client.db("TaskManagerPro").collection("Tasks");
    
    app.get("/tasks", async (req, res) => {
        const email = req.query.email;
        const query = { user_email: email };
        const result = await taskCollection.find(query).toArray();
        res.send(result);
    })

    app.post("/tasks", async (req, res) => {
        const newTask = req.body;
        const result = await taskCollection.insertOne(newTask);
        res.send(result);
    })
    

    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("TaskManagerPro server is running...");
})
app.listen(port, () => {
    console.log("TaskManagerPro server is running on port", port);
})