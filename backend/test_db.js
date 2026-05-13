const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/certificate_verification')
  .then(async () => {
    const user = await User.findOne({ email: 'admin@example.com' }).select('+password');
    console.log('Password in DB:', user.password);
    
    const isMatch = await user.matchPassword('password123');
    console.log('Match with password123?', isMatch);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
