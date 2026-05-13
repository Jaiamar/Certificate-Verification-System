const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/certificate_verification', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const users = await User.find({}).select('+password');
  console.log('Users in DB:');
  users.forEach(u => console.log(`Email: ${u.email}, Password Hash: ${u.password}`));
  mongoose.connection.close();
}).catch(err => {
  console.error(err);
  process.exit(1);
});
