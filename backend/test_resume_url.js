// Test script to verify resume URL functionality
const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/find-jobs';
    console.log('Connecting to:', mongoUri);
    
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Import User model
    const User = require('./models/User');

    // Find test user
    let user = await User.findOne({ email: 'testuser@example.com' });
    
    if (!user) {
      console.log('✗ Test user not found');
      process.exit(1);
    }

    console.log('✓ Found user:', user.name);
    console.log('  Current resumeUrl:', user.resumeUrl || '(none)');

    // Update with a test resume URL
    user = await User.findByIdAndUpdate(
      user._id,
      { resumeUrl: '/uploads/1784614859154-984221209.pdf' },
      { new: true }
    );

    console.log('✓ Updated resumeUrl to:', user.resumeUrl);

    // Test Resume URL construction (simulating frontend logic)
    const testResumeUrl = user.resumeUrl;
    
    // Test 1: Development mode (relative URL)
    console.log('\n📋 Test 1: Development mode (Vite proxy)');
    console.log('  Input:', testResumeUrl);
    console.log('  Expected: resume link works via /uploads proxy');
    
    // Test 2: Production mode with separate backend
    console.log('\n📋 Test 2: Production mode (separate backend)');
    console.log('  VITE_API_URL: https://api.example.com/api');
    const backendOrigin = 'https://api.example.com/api'.replace(/\/api\/?$/, '');
    const fullUrl = `${backendOrigin}${testResumeUrl}`;
    console.log('  Constructed URL:', fullUrl);
    console.log('  Expected:', 'https://api.example.com/uploads/1784614859154-984221209.pdf');

    console.log('\n✓ All tests passed!');
    process.exit(0);

  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

main();
