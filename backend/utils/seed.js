/**
 * Seeds the database with a demo recruiter, company, and a handful of jobs
 * so the app has content to show right after setup.
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Post = require('../models/Post');
const Connection = require('../models/Connection');

const run = async () => {
  await connectDB();

  console.log('Clearing existing demo data...');
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Post.deleteMany({}),
    Connection.deleteMany({}),
  ]);

  const recruiter = await User.create({
    name: 'Priya Sharma',
    email: 'recruiter@demo.com',
    password: 'password123',
    role: 'recruiter',
    companyName: 'NimbusTech',
  });

  const jobseeker = await User.create({
    name: 'Arjun Mehta',
    email: 'jobseeker@demo.com',
    password: 'password123',
    role: 'jobseeker',
    skills: ['JavaScript', 'React', 'Node.js'],
    location: 'Chennai, India',
  });

  const company = await Company.create({
    name: 'NimbusTech',
    owner: recruiter._id,
    industry: 'Software',
    size: '51-200',
    location: 'Bengaluru, India',
    website: 'https://nimbustech.example.com',
    description: 'NimbusTech builds cloud-native tools for developer teams.',
  });

  const jobsData = [
    {
      title: 'Frontend Developer (React)',
      category: 'Engineering',
      jobType: 'full-time',
      experienceLevel: 'mid',
      location: 'Bengaluru, India',
      isRemote: true,
      skills: ['React', 'JavaScript', 'Tailwind CSS'],
      salaryMin: 800000,
      salaryMax: 1400000,
      description: 'Build and maintain our customer-facing dashboard using React and Tailwind.',
      requirements: ['2+ years with React', 'Comfortable with REST APIs', 'Strong CSS fundamentals'],
    },
    {
      title: 'Backend Engineer (Node.js)',
      category: 'Engineering',
      jobType: 'full-time',
      experienceLevel: 'senior',
      location: 'Remote',
      isRemote: true,
      skills: ['Node.js', 'MongoDB', 'Express'],
      salaryMin: 1200000,
      salaryMax: 2000000,
      description: 'Design and scale our core API services on Node.js and MongoDB.',
      requirements: ['4+ years backend experience', 'Experience with MongoDB at scale'],
    },
    {
      title: 'Product Designer',
      category: 'Design',
      jobType: 'full-time',
      experienceLevel: 'mid',
      location: 'Bengaluru, India',
      isRemote: false,
      skills: ['Figma', 'UX Research', 'Design Systems'],
      salaryMin: 900000,
      salaryMax: 1500000,
      description: 'Own end-to-end product design for our job seeker experience.',
      requirements: ['Portfolio required', '3+ years product design experience'],
    },
    {
      title: 'DevOps Intern',
      category: 'Engineering',
      jobType: 'internship',
      experienceLevel: 'entry',
      location: 'Remote',
      isRemote: true,
      skills: ['Docker', 'CI/CD', 'Linux'],
      salaryMin: 20000,
      salaryMax: 30000,
      description: 'Support our platform team with CI/CD pipeline improvements.',
      requirements: ['Familiarity with Docker', 'Currently pursuing a CS degree'],
    },
  ];

  await Job.insertMany(
    jobsData.map((j) => ({ ...j, company: company._id, recruiter: recruiter._id }))
  );

  // Connect the two demo accounts so the feed and network pages have content
  await Connection.create({
    requester: jobseeker._id,
    recipient: recruiter._id,
    status: 'accepted',
  });
  await User.findByIdAndUpdate(jobseeker._id, {
    $addToSet: { connections: recruiter._id },
    $inc: { connectionCount: 1 },
  });
  await User.findByIdAndUpdate(recruiter._id, {
    $addToSet: { connections: jobseeker._id },
    $inc: { connectionCount: 1 },
  });

  await Post.insertMany([
    {
      author: recruiter._id,
      content: "We're hiring! NimbusTech just opened up a few new engineering roles — check them out.",
    },
    {
      author: jobseeker._id,
      content: 'Excited to be exploring new opportunities in frontend development. Open to connect!',
    },
  ]);

  console.log('Seed complete:');
  console.log('  Recruiter login: recruiter@demo.com / password123');
  console.log('  Jobseeker login: jobseeker@demo.com / password123');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
