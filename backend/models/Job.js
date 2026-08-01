const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: 150,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: 8000,
    },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    skills: [{ type: String, trim: true }],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
      default: 'full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead'],
      default: 'entry',
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isRemote: { type: Boolean, default: false },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: 'INR' },
    vacancies: { type: Number, default: 1 },
    applicationDeadline: { type: Date },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
    applicantCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search across title, skills, category
jobSchema.index({ title: 'text', skills: 'text', category: 'text', location: 'text' });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ status: 1 });

module.exports = mongoose.model('Job', jobSchema);
