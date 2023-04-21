const knex = require("knex")(require("../knexfile"));

// Single Item Get Request
exports.singleItem = (req, res) => {
  knex
    .select(
      "inventories.id",
      "warehouses.warehouse_name as warehouse_name",
      "inventories.item_name",
      "inventories.description",
      "inventories.category",
      "inventories.status",
      "inventories.quantity"
    )
    .from("inventories")
    .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id")
    .where("inventories.id", req.params.id)
    .then((data) => {
      if (!data.length)
        res
          .status(404)
          .send(`message: error getting inventory item ${req.params.id}`);
      else res.status(200).json(data[0]);
    })
    .catch((err) =>
      res
        .status(404)
        .send(`message: error getting inventory item ${req.params.id}`)
    );
};

exports.deleteInventoryItem = (req, res) => {
  knex('inventories')
    .delete()
    .where({ id: req.params.id })
    .then((data) => {
      // For DELETE response we can use 204 status code
      if(data)
        res.status(204).send();
      else
        res.status(404).send(`Inventory item with id: ${req.params.id} does not exist`);
    })
    .catch((err) =>
      res.status(500).send(`Error deleting Warehouse ${req.params.id} ${err}`)
    );
};
exports.getAllInventories = async (_req, res) => {
  try {
    const inventories = await knex
      .select(
        "inventories.id",
        "warehouses.warehouse_name as warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .from("inventories")
      .join("warehouses", "inventories.warehouse_id", "=", "warehouses.id");

    res.status(200).json(inventories);
  } catch (err) {
    res.status(400).send(`Error retrieving inventories: ${err}`);
  }
};

// ...

exports.updateInventory = async (req, res) => {
  const { id } = req.params;
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;

  // Validate request body data
  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    quantity === undefined
  ) {
    return res.status(400).send("All values are required (non-empty).");
  }

  if (isNaN(quantity)) {
    return res.status(400).send("Quantity must be a number.");
  }

  try {
    // Check if warehouse_id exists in warehouses table
    const warehouseExists = await knex("warehouses")
      .where("id", warehouse_id)
      .first();

    if (!warehouseExists) {
      return res.status(400).send("Invalid warehouse_id.");
    }

    // Update inventory item
    const updatedRows = await knex("inventories").where("id", id).update({
      warehouse_id,
      item_name,
      description,
      category,
      status,
      quantity,
    });

    if (updatedRows === 0) {
      return res.status(404).send("Inventory ID not found.");
    }

    // Return the updated inventory item without created_at and updated_at
    const updatedInventory = await knex("inventories")
      .select(
        "id",
        "warehouse_id",
        "item_name",
        "description",
        "category",
        "status",
        "quantity"
      )
      .where("id", id)
      .first();

    res.status(200).json(updatedInventory);
  } catch (err) {
    res.status(400).send(`Error updating inventory: ${err}`);
  }
};
