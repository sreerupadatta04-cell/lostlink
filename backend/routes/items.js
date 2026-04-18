const express = require('express');
const router = express.Router();
const { createItem, getItems, getItem, updateItemStatus, deleteItem } = require('../controllers/itemsController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', createItem);
router.get('/', getItems);
router.get('/:id', getItem);
router.patch('/:id/status', updateItemStatus);
router.delete('/:id', deleteItem);

module.exports = router;
