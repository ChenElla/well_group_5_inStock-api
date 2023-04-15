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
  knex("inventories")
    .where({ id: req.params.id })
    .then((data) => {
      if (data[0]) res.status(200).json(data[0]);
      else
        res
          .status(404)
          .json({ message: `error getting inventory item ${req.params.id}` });
    });
};
