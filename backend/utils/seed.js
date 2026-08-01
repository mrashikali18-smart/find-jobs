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
    { title: 'Full Stack Developer (MERN)', category: 'Engineering', jobType: 'full-time', experienceLevel: 'mid', location: 'Chennai, India', isRemote: true, skills: ['MongoDB', 'Express', 'React', 'Node.js'], salaryMin: 700000, salaryMax: 1300000, description: 'Build features across our MERN stack product.', requirements: ['2+ years full stack experience'] },
    { title: 'QA Engineer', category: 'Engineering', jobType: 'full-time', experienceLevel: 'mid', location: 'Pune, India', isRemote: false, skills: ['Selenium', 'Jest', 'Manual Testing'], salaryMin: 600000, salaryMax: 1000000, description: 'Ensure product quality through manual and automated testing.', requirements: ['2+ years QA experience'] },
    { title: 'Data Analyst', category: 'Data', jobType: 'full-time', experienceLevel: 'entry', location: 'Hyderabad, India', isRemote: false, skills: ['SQL', 'Excel', 'Power BI'], salaryMin: 500000, salaryMax: 800000, description: 'Analyze product and business data to drive decisions.', requirements: ['SQL proficiency'] },
    { title: 'Data Scientist', category: 'Data', jobType: 'full-time', experienceLevel: 'senior', location: 'Bengaluru, India', isRemote: true, skills: ['Python', 'Machine Learning', 'Pandas'], salaryMin: 1500000, salaryMax: 2500000, description: 'Build ML models to power product recommendations.', requirements: ['4+ years ML experience'] },
    { title: 'Mobile Developer (React Native)', category: 'Engineering', jobType: 'full-time', experienceLevel: 'mid', location: 'Remote', isRemote: true, skills: ['React Native', 'JavaScript'], salaryMin: 900000, salaryMax: 1600000, description: 'Build and maintain our cross-platform mobile app.', requirements: ['2+ years React Native'] },
    { title: 'DevOps Engineer', category: 'Engineering', jobType: 'full-time', experienceLevel: 'senior', location: 'Bengaluru, India', isRemote: true, skills: ['AWS', 'Kubernetes', 'Docker'], salaryMin: 1400000, salaryMax: 2200000, description: 'Own our cloud infrastructure and deployment pipelines.', requirements: ['4+ years DevOps experience'] },
    { title: 'UI/UX Designer', category: 'Design', jobType: 'full-time', experienceLevel: 'entry', location: 'Mumbai, India', isRemote: false, skills: ['Figma', 'Wireframing'], salaryMin: 450000, salaryMax: 750000, description: 'Design clean, usable interfaces for our web app.', requirements: ['Portfolio required'] },
    { title: 'Product Manager', category: 'Product', jobType: 'full-time', experienceLevel: 'senior', location: 'Bengaluru, India', isRemote: false, skills: ['Roadmapping', 'Agile', 'Analytics'], salaryMin: 1800000, salaryMax: 3000000, description: 'Own the product roadmap for our job seeker experience.', requirements: ['5+ years product management'] },
    { title: 'HR Executive', category: 'Human Resources', jobType: 'full-time', experienceLevel: 'entry', location: 'Chennai, India', isRemote: false, skills: ['Recruitment', 'Onboarding'], salaryMin: 350000, salaryMax: 550000, description: 'Support hiring and onboarding for a growing team.', requirements: ['1+ years HR experience'] },
    { title: 'Digital Marketing Executive', category: 'Marketing', jobType: 'full-time', experienceLevel: 'entry', location: 'Delhi, India', isRemote: false, skills: ['SEO', 'Google Ads', 'Content'], salaryMin: 400000, salaryMax: 650000, description: 'Run digital campaigns to grow our user base.', requirements: ['1+ years marketing experience'] },
    { title: 'Content Writer', category: 'Marketing', jobType: 'part-time', experienceLevel: 'entry', location: 'Remote', isRemote: true, skills: ['Writing', 'SEO'], salaryMin: 250000, salaryMax: 450000, description: 'Write blog posts and marketing copy.', requirements: ['Strong writing portfolio'] },
    { title: 'Sales Executive', category: 'Sales', jobType: 'full-time', experienceLevel: 'entry', location: 'Mumbai, India', isRemote: false, skills: ['B2B Sales', 'CRM'], salaryMin: 400000, salaryMax: 700000, description: 'Drive new business through outbound and inbound sales.', requirements: ['1+ years sales experience'] },
    { title: 'Customer Support Executive', category: 'Support', jobType: 'full-time', experienceLevel: 'entry', location: 'Hyderabad, India', isRemote: false, skills: ['Communication', 'Zendesk'], salaryMin: 300000, salaryMax: 500000, description: 'Resolve customer queries via chat and email.', requirements: ['Good communication skills'] },
    { title: 'Business Analyst', category: 'Product', jobType: 'full-time', experienceLevel: 'mid', location: 'Pune, India', isRemote: false, skills: ['SQL', 'Requirements Gathering'], salaryMin: 800000, salaryMax: 1300000, description: 'Bridge business needs and engineering execution.', requirements: ['2+ years BA experience'] },
    { title: 'Graphic Designer', category: 'Design', jobType: 'contract', experienceLevel: 'entry', location: 'Remote', isRemote: true, skills: ['Photoshop', 'Illustrator'], salaryMin: 20000, salaryMax: 40000, description: 'Create marketing visuals and social media assets.', requirements: ['Design portfolio'] },
    { title: 'Android Developer', category: 'Engineering', jobType: 'full-time', experienceLevel: 'mid', location: 'Bengaluru, India', isRemote: false, skills: ['Kotlin', 'Android SDK'], salaryMin: 900000, salaryMax: 1600000, description: 'Build and ship features on our native Android app.', requirements: ['2+ years Android development'] },
    { title: 'iOS Developer', category: 'Engineering', jobType: 'full-time', experienceLevel: 'mid', location: 'Bengaluru, India', isRemote: false, skills: ['Swift', 'iOS SDK'], salaryMin: 900000, salaryMax: 1600000, description: 'Build and ship features on our native iOS app.', requirements: ['2+ years iOS development'] },
    { title: 'Finance Analyst', category: 'Finance', jobType: 'full-time', experienceLevel: 'mid', location: 'Mumbai, India', isRemote: false, skills: ['Excel', 'Financial Modeling'], salaryMin: 700000, salaryMax: 1100000, description: 'Support budgeting and financial reporting.', requirements: ['2+ years finance experience'] },
    { title: 'Operations Manager', category: 'Operations', jobType: 'full-time', experienceLevel: 'senior', location: 'Delhi, India', isRemote: false, skills: ['Process Improvement', 'Vendor Management'], salaryMin: 1200000, salaryMax: 1900000, description: 'Own day-to-day operations across teams.', requirements: ['5+ years operations experience'] },
    { title: 'Machine Learning Engineer', category: 'Data', jobType: 'full-time', experienceLevel: 'senior', location: 'Remote', isRemote: true, skills: ['Python', 'TensorFlow', 'MLOps'], salaryMin: 1800000, salaryMax: 2800000, description: 'Deploy and scale ML models in production.', requirements: ['4+ years ML engineering'] },
    { title: 'Technical Writer', category: 'Engineering', jobType: 'part-time', experienceLevel: 'entry', location: 'Remote', isRemote: true, skills: ['Documentation', 'Markdown'], salaryMin: 300000, salaryMax: 500000, description: 'Write clear docs for our developer API.', requirements: ['Strong technical writing'] },
    { title: 'Recruiter Coordinator', category: 'Human Resources', jobType: 'internship', experienceLevel: 'entry', location: 'Chennai, India', isRemote: false, skills: ['Scheduling', 'Communication'], salaryMin: 15000, salaryMax: 25000, description: 'Support the recruiting team with interview coordination.', requirements: ['Currently pursuing a degree'] },
  ];

  await Job.insertMany(
    jobsData.map((j) => ({ ...j, currency: 'INR', company: company._id, recruiter: recruiter._id }))
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
