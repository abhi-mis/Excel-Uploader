import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  phone: String,
  experience: String,
  skills: String,
  currentCompany: String,
  currentRole: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Candidate = mongoose.model('Candidate', candidateSchema);