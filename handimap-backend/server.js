const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const placesRoutes = require('./routes/places');
const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/places',placesRoutes);

//routes test
app.get('/',(req,rest) =>{
    rest.json({message:'HandiMap237 API fonctionne!'});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});