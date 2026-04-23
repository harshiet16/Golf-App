const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ['https://golf-app-kappa-dusky.vercel.app', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/user', require('./routes/userRoutes'));

app.use('/api/scores', require('./routes/scoreRoutes'));

app.use('/api/draws', require('./routes/drawRoutes'));

app.use('/api/charities', require('./routes/charityRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
