
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const app = express()
const cors = require('cors')

const port = process.env.PORT || 5000

// username > miasumonru
//  password > NYa77UaeNkpStE5x


// middleware
app.use(cors({origin:["http://localhost:5000", "https://simple-crud-server-lemon.vercel.app"]}))
app.use(express.json())


const uri = "mongodb+srv://miasumonru:NYa77UaeNkpStE5x@cluster0.k8vw6eq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

    // necessary things to insert a document
    const database = client.db("usersDB");
    const userCollection = database.collection("users");

    // creating a get api to read the data already in the database

    app.get('/users', async (req, res) => {
      // read the data from server

      const cursor = userCollection.find();
      const result = await cursor.toArray()

      res.send(result)
    })


    // creating a post api

    app.post('/users', async (req, res) => {
      const user = req.body

      console.log('New User', user)


      // to insert a document to database

      const result = await userCollection.insertOne(user);

      res.send(result)


    })

    // delete a user

    app.delete('/users/:id', async (req, res) => {

      const id = req.params.id
      console.log('Please delete from database this id', id)

      //  request to delete the user to server by id
      const query = { _id: new ObjectId(id) };

      const result = await userCollection.deleteOne(query);

      res.send(result)




    })

    // load dynamic single data 

    app.get('/users/:id', async (req, res) => {

      const id = req.params.id

      console.log(id)

      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);

      res.send(result)


    })
    // Update User by id

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id

      console.log(id)

      const updatedUser = req.body
      console.log(updatedUser)

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };

      // Specify the update to set a value for the plot field
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email
        },
      };

      // Update the first document that matches the filter
      const result = await userCollection.updateOne(filter, updateDoc, options)

      res.send(result)


    })









    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {

  res.send('simple crud server is running')
})

app.listen(port, () => {
  console.log(`simple crud server is running on port : ${port}`)
})