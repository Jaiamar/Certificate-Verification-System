const Certificate = require('../models/Certificate');
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Helper: parse Excel date serial (number) to JS Date
const parseExcelDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  // Excel serial date number
  if (typeof value === 'number') {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));
    return date;
  }
  // Try string parse
  const parsed = new Date(value);
  return isNaN(parsed) ? null : parsed;
};

// @desc    Upload certificates via Excel
// @route   POST /api/certificates/upload
// @access  Private (Admin)
exports.uploadCertificates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please upload an Excel file', code: 'VALIDATION_ERROR' },
      });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      try {
        const row = data[i];

        // Validate required fields
        if (!row.certificateId || !row.studentName || !row.internshipDomain || !row.startDate || !row.endDate) {
          errors.push({ row: i + 2, certificateId: row.certificateId || 'N/A', error: 'Missing required fields (certificateId, studentName, internshipDomain, startDate, endDate)' });
          failedCount++;
          continue;
        }

        // Check for duplicate
        const existingCert = await Certificate.findOne({ certificateId: String(row.certificateId).toUpperCase() });
        if (existingCert) {
          errors.push({ row: i + 2, certificateId: row.certificateId, error: 'Duplicate certificate ID' });
          failedCount++;
          continue;
        }

        const startDate = parseExcelDate(row.startDate);
        const endDate = parseExcelDate(row.endDate);

        if (!startDate || !endDate) {
          errors.push({ row: i + 2, certificateId: row.certificateId, error: 'Invalid date format' });
          failedCount++;
          continue;
        }

        if (startDate >= endDate) {
          errors.push({ row: i + 2, certificateId: row.certificateId, error: 'Start date must be before end date' });
          failedCount++;
          continue;
        }

        await Certificate.create({
          certificateId: String(row.certificateId).toUpperCase(),
          studentName: row.studentName,
          email: row.email || '',
          phoneNumber: row.phoneNumber ? String(row.phoneNumber) : '',
          internshipDomain: row.internshipDomain,
          startDate,
          endDate,
          performanceRating: row.performanceRating || '',
          skills: row.skills ? String(row.skills).split(',').map((s) => s.trim()).filter(Boolean) : [],
          projectsCompleted: row.projectsCompleted ? String(row.projectsCompleted).split(',').map((p) => p.trim()).filter(Boolean) : [],
          mentorName: row.mentorName || '',
          uploadedBy: req.user.id,
        });

        successCount++;
      } catch (err) {
        errors.push({ row: i + 2, certificateId: data[i].certificateId || 'N/A', error: err.message });
        failedCount++;
      }
    }

    // Clean up uploaded file
    try { fs.unlinkSync(req.file.path); } catch (_) {}

    res.status(201).json({
      success: true,
      message: 'Upload processed successfully',
      data: { totalRecords: data.length, successfulUploads: successCount, failedUploads: failedCount, errors },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

// @desc    Search certificate by ID
// @route   GET /api/certificates/search/:certificateId
// @access  Public
exports.searchCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId.toUpperCase(),
      status: 'active',
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: { message: 'Certificate not found or has been revoked', code: 'NOT_FOUND' },
      });
    }

    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

// @desc    Download certificate as PDF
// @route   GET /api/certificates/:certificateId/download
// @access  Public
exports.downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId.toUpperCase(),
      status: 'active',
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: { message: 'Certificate not found', code: 'NOT_FOUND' },
      });
    }

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 60 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate_${certificate.certificateId}.pdf`);
    doc.pipe(res);

    // Background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f0f4ff');

    // Decorative border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(4)
      .stroke('#1e3a8a');

    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
      .lineWidth(1.5)
      .stroke('#3b82f6');

    // Title
    doc.fill('#1e3a8a')
      .font('Helvetica-Bold')
      .fontSize(36)
      .text('CERTIFICATE OF COMPLETION', { align: 'center' });

    doc.moveDown(0.3);
    doc.fill('#3b82f6').font('Helvetica').fontSize(14).text('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', { align: 'center' });

    doc.moveDown(0.8);
    doc.fill('#374151').font('Helvetica').fontSize(14).text('This is to certify that', { align: 'center' });

    doc.moveDown(0.5);
    doc.fill('#1e3a8a').font('Helvetica-Bold').fontSize(28).text(certificate.studentName, { align: 'center', underline: false });

    doc.moveDown(0.5);
    doc.fill('#374151').font('Helvetica').fontSize(14).text('has successfully completed the internship program in', { align: 'center' });

    doc.moveDown(0.3);
    doc.fill('#1d4ed8').font('Helvetica-Bold').fontSize(20).text(certificate.internshipDomain, { align: 'center' });

    doc.moveDown(0.7);

    const startDateStr = new Date(certificate.startDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    const endDateStr = new Date(certificate.endDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    doc.fill('#374151').font('Helvetica').fontSize(13).text(`from  ${startDateStr}  to  ${endDateStr}`, { align: 'center' });

    doc.moveDown(0.5);
    doc.fill('#4b5563').font('Helvetica').fontSize(12).text(`Duration: ${certificate.duration}`, { align: 'center' });

    if (certificate.performanceRating) {
      doc.text(`Performance: ${certificate.performanceRating}`, { align: 'center' });
    }

    if (certificate.skills && certificate.skills.length > 0) {
      doc.moveDown(0.3);
      doc.fill('#374151').font('Helvetica').fontSize(11).text(`Skills Acquired: ${certificate.skills.join(', ')}`, { align: 'center' });
    }

    doc.moveDown(0.5);
    doc.fill('#6b7280').font('Helvetica').fontSize(11).text(`Certificate ID: ${certificate.certificateId}`, { align: 'center' });
    doc.text(`Issue Date: ${new Date(certificate.issueDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });

    // Signature lines
    const sigY = doc.page.height - 110;
    doc.moveTo(80, sigY).lineTo(280, sigY).stroke('#1e3a8a');
    doc.moveTo(doc.page.width - 280, sigY).lineTo(doc.page.width - 80, sigY).stroke('#1e3a8a');

    doc.fill('#374151').font('Helvetica').fontSize(10)
      .text(certificate.mentorName || 'Authorized Signatory', 80, sigY + 5, { width: 200, align: 'center' })
      .text('Date of Issue', doc.page.width - 280, sigY + 5, { width: 200, align: 'center' });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

// @desc    Get all certificates (admin, paginated)
// @route   GET /api/certificates
// @access  Private (Admin)
exports.getAllCertificates = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      query.$or = [
        { studentName: { $regex: req.query.search, $options: 'i' } },
        { certificateId: { $regex: req.query.search, $options: 'i' } },
        { internshipDomain: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.status) query.status = req.query.status;
    if (req.query.domain) query.internshipDomain = { $regex: req.query.domain, $options: 'i' };

    const total = await Certificate.countDocuments(query);
    const certificates = await Certificate.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'fullName email');

    res.status(200).json({
      success: true,
      data: {
        certificates,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRecords: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

// @desc    Get single certificate by MongoDB ID
// @route   GET /api/certificates/:id
// @access  Private (Admin)
exports.getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate('uploadedBy', 'fullName email');
    if (!certificate) {
      return res.status(404).json({ success: false, error: { message: 'Certificate not found', code: 'NOT_FOUND' } });
    }
    res.status(200).json({ success: true, data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private (Admin)
exports.updateCertificate = async (req, res) => {
  try {
    const disallowed = ['certificateId', 'uploadedBy', '_id'];
    disallowed.forEach((key) => delete req.body[key]);

    const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!certificate) {
      return res.status(404).json({ success: false, error: { message: 'Certificate not found', code: 'NOT_FOUND' } });
    }

    res.status(200).json({ success: true, message: 'Certificate updated successfully', data: certificate });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private (Admin)
exports.deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ success: false, error: { message: 'Certificate not found', code: 'NOT_FOUND' } });
    }
    res.status(200).json({ success: true, message: 'Certificate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/certificates/stats/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalCertificates = await Certificate.countDocuments();
    const activeCertificates = await Certificate.countDocuments({ status: 'active' });
    const revokedCertificates = await Certificate.countDocuments({ status: 'revoked' });

    const domainAgg = await Certificate.aggregate([
      { $group: { _id: '$internshipDomain', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const certificatesByDomain = {};
    domainAgg.forEach((d) => { certificatesByDomain[d._id] = d.count; });

    const recentUploads = await Certificate.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploadedBy', 'fullName');

    res.status(200).json({
      success: true,
      data: { totalCertificates, activeCertificates, revokedCertificates, certificatesByDomain, recentUploads },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message, code: 'SERVER_ERROR' } });
  }
};
