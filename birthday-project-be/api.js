const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const https = require('https');


const app = express();

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.json());

// app.use(cors({ origin: 'https://shir-project.vercel.app' }));
// app.use(cors({ origin: 'http://localhost:3000' }));

const allowedOrigins = ['http://localhost:3000', 'https://shir-project.vercel.app'];

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

app.use(cors(corsOptions));

const dataDirectory = '../Reviews';

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory);
}

app.get('/movies/:name', (req, res) => {
  const movieName = req.params.name;
  const filePath = path.join(dataDirectory, `${movieName}.json`);

  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(JSON.parse(data));
    });
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

app.get('/movies', (req, res) => {
  fs.readdir(dataDirectory, (err, fileNames) => {
    if (err) {
        console.error('Error reading directory:', err);
        return res.status(500).send('Internal Server Error');
    }

    const fileNamesWithoutExtensions = fileNames.map(fileName => {
        return path.parse(fileName).name;
    });

    res.json(fileNamesWithoutExtensions);
});
})

app.post('/movies', (req, res) => {
  console.log(req)
  const { name, description, rating, youtubeId, source, imageData } = req.body;
  if (!name || !rating || !imageData) {
    return res.status(400).json({ error: 'Name, rating, and imageData are required' });
  }

  const filePath = path.join(dataDirectory, `${name}.json`);
  const movieData = { name, rating, description, youtubeId, source, imageData };

  fs.writeFile(filePath, JSON.stringify(movieData), (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to save movie data' });
    }
    res.status(201).json({ message: 'Movie data saved successfully' });
  });
});

const httpsServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'cert-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
},app);

httpsServer.listen(3443, () => console.log('open on port 3443'));