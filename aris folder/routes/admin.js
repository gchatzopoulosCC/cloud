const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { checkRole } = require('../middlewares/roleMiddleware');

// Admin-only route to get all users
router.get('/users', checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Admin-only route to delete a user
router.delete('/users/:id', checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.send('User deleted successfully');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Admin-only route to update user roles
router.put('/users/:id/role', checkRole(['admin']), async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'editor', 'viewer'].includes(role)) {
    return res.status(400).send('Invalid role');
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
