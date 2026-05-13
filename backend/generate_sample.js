const xlsx = require('xlsx');
const fs = require('fs');

const sampleData = [
  {
    certificateId: 'CERT-2023-001',
    studentName: 'Alice Smith',
    email: 'alice@example.com',
    phoneNumber: '1234567890',
    internshipDomain: 'Web Development',
    startDate: '2023-01-15',
    endDate: '2023-04-15',
    performanceRating: 'Excellent',
    skills: 'HTML, CSS, JavaScript, React',
    projectsCompleted: 'Portfolio Website, E-commerce Frontend',
    mentorName: 'John Doe'
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
    skills: 'Python, Pandas, Scikit-Learn',
    projectsCompleted: 'Sales Prediction Model, Customer Segmentation',
    mentorName: 'Jane Smith'
  },
  {
    certificateId: 'CERT-2023-003',
    studentName: 'Charlie Brown',
    email: 'charlie@example.com',
    phoneNumber: '5551234567',
    internshipDomain: 'UI/UX Design',
    startDate: '2023-03-10',
    endDate: '2023-06-10',
    performanceRating: 'Good',
    skills: 'Figma, Adobe XD, Wireframing',
    projectsCompleted: 'Mobile App Redesign',
    mentorName: 'Emily Clark'
  },
  {
    certificateId: 'CERT-2023-004',
    studentName: 'Diana Prince',
    email: 'diana@example.com',
    phoneNumber: '4449876543',
    internshipDomain: 'Cybersecurity',
    startDate: '2023-05-01',
    endDate: '2023-08-01',
    performanceRating: 'Outstanding',
    skills: 'Network Security, Penetration Testing, Wireshark',
    projectsCompleted: 'Vulnerability Assessment Report',
    mentorName: 'Bruce Wayne'
  },
  {
    certificateId: 'CERT-2023-005',
    studentName: 'Ethan Hunt',
    email: 'ethan@example.com',
    phoneNumber: '3335557777',
    internshipDomain: 'Cloud Computing',
    startDate: '2023-06-15',
    endDate: '2023-09-15',
    performanceRating: 'Excellent',
    skills: 'AWS, Docker, Kubernetes',
    projectsCompleted: 'Microservices Deployment',
    mentorName: 'Alan Turing'
  }
];

const worksheet = xlsx.utils.json_to_sheet(sampleData);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Certificates');

const outputPath = 'sample_certificates.xlsx';
xlsx.writeFile(workbook, outputPath);

console.log(`Sample data successfully generated at ${outputPath}`);
