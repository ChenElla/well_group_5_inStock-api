const router = require("express").Router();
const inventoryController = require("../controllers/inventoryController");
// const knex = require("knex")(require("../knexfile"));

// router.route("/").get(inventoryController.index);
router.route("/").get(inventoryController.getAllInventories);
router.route("/").post(inventoryController.upsertItem);
router.put("/:id", inventoryController.upsertItem);

// api/inventories/:id
router.route("/inventory/:id").get(inventoryController.singleItem);

module.exports = router;
