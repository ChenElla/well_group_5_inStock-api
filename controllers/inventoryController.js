const knex = require("knex")(require("../knexfile"));

exports.index = (_req, res) => {
  knex("inventories")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error Retrieving Inventories: ${err}`)
    );
};

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
      if (data[0]) {
        data_to_display = [];
        console.log(data);
        data.forEach((e) => {
          data_to_display.push({
            id: e.id,
            warehouse_name: e.warehouse_name,
            item_name: e.item_name,
            description: e.description,
            category: e.category,
            status: e.status,
            quantity: e.quantity,
          });
        });
        res.status(200).json(data[0]);
      } else
        res
          .status(404)
          .json({ message: `error getting inventory item ${req.params.id}` });
    });
};
