const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require('cors');
const app = express();
require("dotenv").config();

const port = process.env.PORT || 5000;

const corsOptions = {
  origin: 'https://task-management-system-9b1cf.web.app', // Replace with your frontend URL
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());

// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6aqk9ji.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const tasksCollection = client.db("taskManagement").collection("tasks");
    // tasks related

    app.get("/tasks", cors(corsOptions), async (req, res) => {
      const result = await tasksCollection.find().toArray();
      res.send(result);
    });

    app.get("/tasks/:id",cors(corsOptions), async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await tasksCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    app.post("/tasks", cors(corsOptions), async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      console.log(result);
      res.send(result);
    });

    app.delete("/tasks/:id", cors(corsOptions), async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });

    // app.patch("/tasks/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const { status } = req.body;

    //   if (!ObjectId.isValid(id)) {
    //     return res.status(400).send("Invalid ObjectId format");
    //   }

    //   const filter = { _id: new ObjectId(id) };
    //   const updatedTask = { $set: { status } };

    //   try {
    //     const result = await tasksCollection.updateOne(filter, updatedTask);

    //     if (result.modifiedCount > 0) {
    //       res.status(200).send("Task status updated successfully");
    //     } else {
    //       res.status(404).send("Task not found");
    //     }
    //   } catch (error) {
    //     res.status(500).send("Internal server error");
    //   }
    // });

    app.put("/tasks/:id",cors(corsOptions), async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid ObjectId format");
      }

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUSer = {
        $set: {
          title: data.title,
          description: data.description,
          date: data.date,
          level: data.level,
        },
      };
      const result = await tasksCollection.updateOne(
        filter,
        updatedUSer,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});
