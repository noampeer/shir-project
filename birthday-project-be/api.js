const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { MongoClient } = require('mongodb');

// MongoDB connection URI and database name
const mongoURI = 'mongodb+srv://noampeer23:noam23012004@shir-mongo.2gsqx2i.mongodb.net/?retryWrites=true&w=majority&appName=shir-mongo';
const dbName = 'Movie-Information';
const port = process.env.PORT || 4000;

// Initialize Express app
const app = express();

app.use(bodyParser.json({ limit: '20mb' }));

const allowedOrigins = ['https://shir-project.vercel.app'];
const renderAppName = 'https://shir-project.onrender.com'


const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200
};

function reloadSite() {
  fetch(renderAppName + '/movies')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('reloaded_server');
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

app.use(cors(corsOptions));

// Create a new MongoClient
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const moviesCollection = db.collection('Movie');

    app.get('/movies/:name', async (req, res) => {
      const movieName = req.params.name;
      try {
        const movie = await moviesCollection.findOne({ name: movieName });
        if (movie) {
          res.json(movie);
          console.log("Sent response with movies")
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.get('/movies', async (req, res) => {
      try {
        const movies = await moviesCollection.find({}).project({ name: 1, _id: 0 }).toArray();
        const movieNames = movies.map(movie => movie.name);
        res.json(movieNames);
      } catch (err) {
        res.status(500).send('Internal Server Error');
      }
    });

    app.post('/movies', async (req, res) => {
      const { name, description, rating, youtubeId, source, imageData } = req.body;
      if (!name || !rating || !imageData) {
        return res.status(400).json({ error: 'Name, rating, and imageData are required' });
      }

      const movieData = { name, rating, description, youtubeId, source, imageData };
      try {
        await moviesCollection.insertOne(movieData);
        console.log("Movie data saved successfully")
        res.status(201).json({ message: 'Movie data saved successfully' });
      } catch (err) {
        res.status(500).json({ error: 'Failed to save movie data' });
      }
    });
    
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })

    setInterval(reloadSite, 30000)

  } catch (err) {
    console.error(err);
  }
}

run().catch(console.error);
