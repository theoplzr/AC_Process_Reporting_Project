require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const planRoutes = require('./routes/planRoutes');
const pdfRoutes = require('./routes/pdf');

const app = express();
const port = process.env.PORT || 3307;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Middleware CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(cors());

// Routes
app.use('/api/plans', planRoutes);
app.use('/api/pdf', pdfRoutes);

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/photos', express.static(path.join(__dirname, 'photos')));

// Lancer le serveur Express et écouter sur le port défini
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
