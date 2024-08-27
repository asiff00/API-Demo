const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const multiplyRoutes = require('./routes/multiplyRoutes');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/auth', authRoutes);
app.use('/api', apiKeyRoutes);
app.use('/', multiplyRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});