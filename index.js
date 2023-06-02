const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// job-task-management
// TVfaZXfTPMWZ4oTi
const uri = `mongodb+srv://job-task-management:TVfaZXfTPMWZ4oTi@cluster0.k0vsmln.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const taskCollection = client.db("taskDb").collection("taskCollection");


    app.get("/alltask", async(req, res) =>{
        const result = await taskCollection.find().sort({ createdAt: -1 }).toArray();
        res.send(result);
    })
    app.get("/singletask/:id", async (req, res)=>{
      const id = req.params.id
      query = { _id: new ObjectId(id) }
      const result = await taskCollection.findOne(query);
      res.send(result);

    })

    
    app.post("/addtask", async (req, res) =>{
      const addedTask = req.body;
      addedTask.createdAt = new Date();
      const result = await taskCollection.insertOne(addedTask)
      res.send(result);
    })

    app.put("/updatetask/:id", async (req, res)=>{
      const id = req.params.id;
      const body = req.body;
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const updateData = {
          $set: {
              ...body
          },
      };
      const result = await taskCollection.updateOne(filter, updateData, options);
      res.send(result);
    })

     // Delete Toy 
  app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const query = { _id: new ObjectId(id) };
    const result = await taskCollection.deleteOne(query);
    res.send(result);
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



app.get("/", (req, res) => {
  res.send(" Task is running");
})



app.listen(port, () => {
  console.log(`Task is running on port ${port}`);
})