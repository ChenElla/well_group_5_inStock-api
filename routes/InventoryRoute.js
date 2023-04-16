const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");

router.route("/").get(inventoryController.getAllInventories);
router.put("/:id", inventoryController.updateInventory);

module.exports = router;
