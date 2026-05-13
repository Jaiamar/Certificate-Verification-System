require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Certificate = require('./models/Certificate');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/certificate_system')
  .then(async () => {
    console.log('Connected to DB. Seeding extended data...');

    // Clear existing data for a clean slate
    await User.deleteMany({});
    await Certificate.deleteMany({});

    // Create an admin user
    const adminUser = new User({
      fullName: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });
    await adminUser.save();
    console.log('Admin user created: admin@example.com / password123');

    // Create a regular user
    const regularUser = new User({
      fullName: 'John Doe',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
    });
    await regularUser.save();
    console.log('Regular user created: user@example.com / password123');

    // Create sample certificates
    const sampleCertificates = [
      {
        certificateId: 'CERT-2023-001',
        studentName: 'Alice Smith',
        email: 'alice@example.com',
        phoneNumber: '1234567890',
        internshipDomain: 'Web Development',
        startDate: '2023-01-15',
        endDate: '2023-04-15',
        performanceRating: 'Excellent',
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        projectsCompleted: ['Portfolio Website', 'E-commerce Frontend'],
        mentorName: 'Jane Manager',
        uploadedBy: adminUser._id,
        status: 'active'
      },
      {
        certificateId: 'CERT-2023-002',
        studentName: 'Bob Johnson',
        email: 'bob@example.com',
        phoneNumber: '0987654321',
        internshipDomain: 'Data Science',
        startDate: '2023-02-01',
        endDate: '2023-05-01',
        performanceRating: 'Very Good',
        skills: ['Python', 'Pandas', 'Scikit-Learn'],
        projectsCompleted: ['Sales Prediction Model', 'Customer Segmentation'],
        mentorName: 'Alice Supervisor',
        uploadedBy: adminUser._id,
        status: 'active'
      },
      {
        certificateId: 'CERT-2023-003',
        studentName: 'Charlie Brown',
        email: 'charlie@example.com',
        phoneNumber: '1112223333',
        internshipDomain: 'Cloud Computing',
        startDate: '2022-10-01',
        endDate: '2023-01-01',
        performanceRating: 'Good',
        skills: ['AWS', 'Docker', 'Kubernetes'],
        projectsCompleted: ['Microservices Deployment'],
        mentorName: 'Jane Manager',
        uploadedBy: regularUser._id,
        status: 'active'
      },
      {
        certificateId: 'CERT-2023-004',
        studentName: 'Diana Prince',
        email: 'diana@example.com',
        phoneNumber: '4445556666',
        internshipDomain: 'Cybersecurity',
        startDate: '2023-03-01',
        endDate: '2023-06-01',
        performanceRating: 'Outstanding',
        skills: ['Network Security', 'Penetration Testing'],
        projectsCompleted: ['Vulnerability Assessment'],
        mentorName: 'Bruce Wayne',
        uploadedBy: regularUser._id,
        status: 'revoked'
      },
      {
        certificateId: 'CERT-2023-005',
        studentName: 'Ethan Hunt',
        email: 'ethan@example.com',
        phoneNumber: '7778889999',
        internshipDomain: 'Web Development',
        startDate: '2023-05-15',
        endDate: '2023-08-15',
        performanceRating: 'Excellent',
        skills: ['Node.js', 'Express', 'MongoDB'],
        projectsCompleted: ['REST API Development'],
        mentorName: 'Jane Manager',
        uploadedBy: adminUser._id,
        status: 'active'
      },
      {
        certificateId: 'CERT-2023-006',
        studentName: 'Fiona Gallagher',
        email: 'fiona@example.com',
        phoneNumber: '2223334444',
        internshipDomain: 'Data Science',
        startDate: '2023-06-01',
        endDate: '2023-09-01',
        performanceRating: 'Good',
        skills: ['R', 'Machine Learning', 'Data Visualization'],
        projectsCompleted: ['Market Basket Analysis'],
        mentorName: 'Alice Supervisor',
        uploadedBy: regularUser._id,
        status: 'active'
      },
      {
        certificateId: 'CERT-2023-007',
        studentName: 'George Miller',
        email: 'george@example.com',
        phoneNumber: '5556667777',
        internshipDomain: 'UI/UX Design',
        startDate: '2023-01-10',
        endDate: '2023-04-10',
        performanceRating: 'Excellent',
        skills: ['Figma', 'Adobe XD', 'Prototyping'],
        projectsCompleted: ['Mobile App Redesign'],
        mentorName: 'Bruce Wayne',
        uploadedBy: adminUser._id,
        status: 'revoked'
      }
    ];

    await Certificate.insertMany(sampleCertificates);
    console.log(`Successfully inserted ${sampleCertificates.length} certificates.`);

    mongoose.connection.close();
    console.log('Seeding finished!');
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
