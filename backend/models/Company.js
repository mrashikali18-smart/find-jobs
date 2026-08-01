const mongoose = require('mongoose');
const slugify = require('slugify');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
    },
    slug: { type: String, unique: true },
    logoUrl: { type: String, default: '' },
    website: { type: String, trim: true },
    industry: { type: String, trim: true },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    location: { type: String, trim: true },
    description: { type: String, maxlength: 3000 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // HR contact — who candidates / support can reach for this company
    hrContact: {
      name: { type: String, trim: true },
      phone: {
        type: String,
        trim: true,
        match: [/^[+]?[\d\s().-]{7,20}$/, 'Please provide a valid phone number'],
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
      },
    },
    // Hiring / matching preferences used to rank candidates and filter applicants
    preferences: {
      remoteFriendly: { type: Boolean, default: false },
      preferredIndustries: [{ type: String, trim: true }],
      minExperienceYears: { type: Number, min: 0, default: 0 },
      requiredSkills: [{ type: String, trim: true }],
      hiringVolume: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low',
      },
    },
  },
  { timestamps: true }
);

companySchema.pre('validate', function setSlug(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Company', companySchema);
