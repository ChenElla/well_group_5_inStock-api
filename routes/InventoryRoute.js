const router = require('express').Router();
const inventoryController = require('../controllers/InventoryController');

router.route('/').get(inventoryController.getAllInventories);
router.put('/:id', inventoryController.updateInventory);

module.exports = router;