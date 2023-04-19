const router = require('express').Router();
const warehouseController = require('../controllers/warehouseController');

router.route('/').get(warehouseController.allWarehouses);

router.route('/:id').get(warehouseController.singleWarehouse).put(warehouseController.updateWarehouse);



module.exports = router;