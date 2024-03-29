const router = require('express').Router();
const warehouseController = require('../controllers/warehouseController');

router.route('/').get(warehouseController.allWarehouses).post(warehouseController.addWarehouse);

router.route('/:id').get(warehouseController.singleWarehouse).put(warehouseController.updateWarehouse).delete(warehouseController.deleteWarehouse);

router.route('/:id/inventories').get(warehouseController.warehouseInventories);
router.route('/name_to_id/:warehouseName').get(warehouseController.getWarehouseId);
router.route('*')
module.exports = router;