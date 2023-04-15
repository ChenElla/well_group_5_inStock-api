const knex = require('knex')(require('../knexfile'));

exports.index = (_req, res) => {
  knex('inventories')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Inventories: ${err}`)
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