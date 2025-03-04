const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./generatedKey.json'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// GET /models
app.get('/models', async (req, res) => {
  try {
    const modelsCollection = await db.collection('models').get();
    const models = modelsCollection.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// POST /upload
app.post('/upload', async (req, res) => {
  const { name, description, url } = req.body;
  const uploadDate = new Date();

  try {
    await db.collection('models').add({
      name,
      description,
      url,
      uploadDate,
    });
    res.status(201).json({ message: 'Model uploaded successfully' });
  } catch (error) {
    console.error('Error uploading model:', error);
    res.status(500).json({ error: 'Failed to upload model' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});