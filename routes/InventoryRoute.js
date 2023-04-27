const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");

router
	.route("/")
	.get(inventoryController.getAllInventories)
	.post(inventoryController.upsertItem);
router
	.route("/:id")
	.delete(inventoryController.deleteInventoryItem)
	.put(inventoryController.upsertItem)
	.get(inventoryController.singleItem);
module.exports = router;
