import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { uploadCandidates, getCandidates } from './controllers/candidateController';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/candidates';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.post('/api/upload', upload.single('file'), uploadCandidates);
app.get('/api/candidates', getCandidates);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});