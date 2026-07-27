const Grievance = require('../models/Grievance');

// @desc    Submit a new grievance
// @route   POST /api/grievances
// @access  Private (USER)
const createGrievance = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Grievance title is required' });
    }

    if (!description || description.trim() === '') {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const grievance = await Grievance.create({
      userId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      category,
      imageUrl,
      status: 'Pending',
      adminRemarks: ''
    });

    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully',
      grievance
    });
  } catch (error) {
    console.error('Create Grievance Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error submitting grievance' });
  }
};

// @desc    Get all grievances submitted by current user
// @route   GET /api/grievances/my
// @access  Private (USER)
const getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: grievances.length,
      grievances
    });
  } catch (error) {
    console.error('Get My Grievances Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving your grievances' });
  }
};

// @desc    Get all grievances (Admin Dashboard)
// @route   GET /api/grievances/admin/all
// @access  Private (ADMIN)
const getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    const total = grievances.length;
    const pending = grievances.filter(g => g.status === 'Pending').length;
    const inProgress = grievances.filter(g => g.status === 'In Progress').length;
    const resolved = grievances.filter(g => g.status === 'Resolved').length;

    res.status(200).json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved
      },
      grievances
    });
  } catch (error) {
    console.error('Get All Grievances Error:', error);
    res.status(500).json({ success: false, message: 'Error retrieving all grievances' });
  }
};

// @desc    Update grievance status & admin remarks
// @route   PUT /api/grievances/:id/status
// @access  Private (ADMIN)
const updateGrievanceStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const { id } = req.params;

    const allowedStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const grievance = await Grievance.findById(id);

    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    if (status) grievance.status = status;
    if (adminRemarks !== undefined) grievance.adminRemarks = adminRemarks.trim();

    await grievance.save();
    
    const updatedGrievance = await Grievance.findById(id).populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Grievance status updated successfully',
      grievance: updatedGrievance
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating grievance status' });
  }
};

module.exports = {
  createGrievance,
  getMyGrievances,
  getAllGrievances,
  updateGrievanceStatus
};
