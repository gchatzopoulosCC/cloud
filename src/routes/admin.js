const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust to Sequelize's model usage
const { checkRole } = require('../middlewares/roleMiddleware');
require('dotenv').config();

// Admin-only route to get all users
router.get('/users', checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin-only route to delete a user
router.delete('/users/:id', checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.destroy({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin-only route to update user roles
router.put('/users/:id/role', checkRole(['admin']), async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'editor', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const user = await User.update(
      { role },
      { where: { id: req.params.id }, returning: true, plain: true }
    );
    if (!user[1]) return res.status(404).json({ error: 'User not found' });
    res.json(user[1]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
