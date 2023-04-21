const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");

router.route("/").get(inventoryController.getAllInventories);
router.route("/").delete(inventoryController.deleteInventoryItem).put("/:id", inventoryController.updateInventory);

// api/inventories/:id
router.route("/inventory/:id").get(inventoryController.singleItem);

module.exports = router;
