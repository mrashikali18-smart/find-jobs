const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['jobseeker', 'recruiter', 'admin'],
      default: 'jobseeker',
    },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    avatarUrl: { type: String, default: '' },
    headline: { type: String, maxlength: 150 },
    bio: { type: String, maxlength: 2000 },
    skills: [{ type: String, trim: true }],
    resumeUrl: { type: String, default: '' },
    experience: [experienceSchema],
    education: [educationSchema],
    // Recruiter-specific fields
    companyName: { type: String, trim: true },
    companyWebsite: { type: String, trim: true },
    companyDescription: { type: String, maxlength: 2000 },
    isActive: { type: Boolean, default: true },
    coverImageUrl: { type: String, default: '' },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    connectionCount: { type: Number, default: 0 },
    // Job seeker preferences — used by search/matching
    jobPreferences: {
      desiredRoles: [{ type: String, trim: true }],
      preferredLocations: [{ type: String, trim: true }],
      remoteOnly: { type: Boolean, default: false },
      employmentTypes: [
        { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'] },
      ],
      minSalaryExpectation: { type: Number, min: 0 },
    },
    // Record of a LinkedIn data-export import, so we know what came from LinkedIn vs. was typed
    linkedinImport: {
      importedAt: { type: Date },
      sourceFile: { type: String, trim: true }, // original export filename, for reference only
      profileUrl: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

userSchema.index({ name: 'text', headline: 'text', skills: 'text' });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
