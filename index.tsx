const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3fo4t.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000

app.get('/', (req, res) => {
  res.send("Welcome to Eucaps-task server.")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const subscribersCollection = client.db(`${process.env.DB_NAME}`).collection("subscribers");

  app.post('/addSubscriber', (req, res) => {
    const subscriber = req.body;
    subscribersCollection.insertOne(subscriber)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/subscribers', (req, res) => {
    subscribersCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
});


app.listen(process.env.PORT || port);