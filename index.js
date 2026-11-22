import express from 'express';
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'

const app = express();
const port =process.env.Port || 5000;

app.use(express.json());
app.use(cors());

const client = new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-ooox2b5-shard-00-00.wywzt4u.mongodb.net:27017,ac-ooox2b5-shard-00-01.wywzt4u.mongodb.net:27017,ac-ooox2b5-shard-00-02.wywzt4u.mongodb.net:27017/?ssl=true&replicaSet=atlas-hhmttl-shard-0&authSource=admin`);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient = await connectToMongoDB();
const database = connectedClient.db("bigbitedb");
const users = database.collection("user")
const menu = database.collection("menu")

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', async (req, res) => {
  const cursor = users.find({});
  const result = await cursor.toArray();
  res.send(result);
})

app.post('/menu',async (req, res) =>{
  const menuItem = req.body;
  const result = await menu.insertOne(menuItem);
  res.send(result)
})

app.get('/menu', async (req, res) => {
  const result = await menu.find({}).toArray();
  res.send(result);
});

app.delete("/menu/:id", async (req, res) => {
  const result = await menu.deleteOne({
    _id: new ObjectId(req.params.id),
  });

  res.send(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});