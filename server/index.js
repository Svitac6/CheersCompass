import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UserRouter } from './routes/user.js';
import { BarRouter } from './routes/bar.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use('/auth', UserRouter, BarRouter);

// Recréer __dirname en utilisant fileURLToPath et path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Créer le répertoire uploads s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Répertoire uploads créé');
}

// Servir les fichiers uploadés de manière statique
app.use('/uploads', express.static(uploadDir));

mongoose.connect('mongodb://127.0.0.1:27017/authentification', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
