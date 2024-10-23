import express from 'express';
import { config } from './config/env.js'; // Assuming your config.js is in the same folder
import routes from './routes/index.js';
import { connectDB } from './config/db.js';

const app = express();
app.use(express.json());
app.get('/test', (req, res) => {
    res.send("this is test route");
});

connectDB()

app.use('/api', routes)
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});

