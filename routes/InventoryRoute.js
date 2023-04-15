const router = require('express').Router();
const inventoryController = require('../controllers/InventoryController');

router.route('/').get(inventoryController.index);
router.route('/:id').delete(inventoryController.deleteInventoryItem);
module.exports = router;