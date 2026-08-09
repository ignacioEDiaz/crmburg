const express = require('express');
const cors = require('cors');
const apiRoutes = require('./interfaces/routes');

const app = express();

app.use(cors());

// Aumentar el límite del body parser de Express a 50MB para soportar imágenes en Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/v1', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
