const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: [true, 'Certificate ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    internshipDomain: {
      type: String,
      required: [true, 'Internship domain is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    duration: {
      type: String,
    },
    performanceRating: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    projectsCompleted: {
      type: [String],
      default: [],
    },
    mentorName: {
      type: String,
      trim: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['active', 'revoked'],
      default: 'active',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-calculate duration before saving
certificateSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;

    if (months > 0) {
      this.duration = days > 0 ? `${months} month${months > 1 ? 's' : ''} ${days} day${days > 1 ? 's' : ''}` : `${months} month${months > 1 ? 's' : ''}`;
    } else {
      this.duration = `${days} day${days > 1 ? 's' : ''}`;
    }
  }
  next();
});

// Indexes
certificateSchema.index({ studentName: 'text', email: 'text', internshipDomain: 'text' });
certificateSchema.index({ status: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
