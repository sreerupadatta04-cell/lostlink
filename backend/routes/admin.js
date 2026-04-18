const express = require('express');
const router = express.Router();
const { getAllUsers, getAllItems, getAllReports, deleteUser } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/items', getAllItems);
router.get('/reports', getAllReports);

module.exports = router;
