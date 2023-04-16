const knex = require('knex')(require('../knexfile'));

exports.index = (_req, res) => {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving Warehouses: ${err}`)
    );
};

exports.singleWarehouse = (req, res) => {
  knex("warehouses")
<<<<<<< HEAD
    .select(
      'id',
      'warehouse_name',
      'address',
      'city',
      'country',
      'contact_name',
      'contact_position',
      'contact_phone',
      'contact_email'
    )
=======
>>>>>>> develop
    .where({ id: req.params.id })
    .then((data) => {
      // If record is not found, respond with 404
      if (!data.length) {
        return res
          .status(404)
          .send(`Record with id: ${req.params.id} is not found`);
      }

      // Knex returns an array of records, so we need to send response with a single object only
      res.status(200).json(data[0]);
    })
    .catch((err) =>
      res.status(400).send(`Error retrieving warehouse ${req.params.id} ${err}`)
    );
};


exports.warehouseInventories = (req, res) => {
  knex('inventories')
    .where({ warehouse_id: req.params.id })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) =>
      res
        .status(400)
        .send(
          `Error retrieving inventories for Warehouse ${req.params.id} ${err}`
        )
    );
};

exports.addWarehouse = (req, res) => {
  // Validate the request body for required data
  if (!req.body.name || !req.body.manager || !req.body.address || !req.body.phone || !req.body.email) {
    return res.status(400).send('Please make sure to provide name, manager, address, phone and email fields in a request');
  }

  knex('warehouses')
    .insert(req.body)
    .then((data) => {
      // For POST requests we need to respond with 201 and the location of the newly created record
      const newWarehouseURL = `/warehouses/${data[0]}`;
      res.status(201).location(newWarehouseURL).send(newWarehouseURL);
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};

exports.updateWarehouse = (req, res) => {
  knex('warehouses')
    .update(req.body)
    .where({ id: req.params.id })
    .then(() => {
      res.status(200).send(`Warehouse with id: ${req.params.id} has been updated`);
    })
    .catch((err) =>
      res.status(400).send(`Error updating Warehouse ${req.params.id} ${err}`)
    );
};

exports.updateWarehouse = (req, res) => {
  knex('warehouses')
    .update(req.body)
    .where({ id: req.params.id })
    .then(() => {
      res.status(200).send(`Warehouse with id: ${req.params.id} has been updated`);
    })
    .catch((err) =>
      res.status(500).send(`Error updating Warehouse ${req.params.id} ${err}`)
    );
};

exports.deleteWarehouse = (req, res) => {
  knex('warehouses')
    .delete()
    .where({ id: req.params.id })
    .then(() => {
      // For DELETE response we can use 204 status code
      res.status(204).send(`Warehouse with id: ${req.params.id} has been deleted`);
    })
    .catch((err) =>
      res.status(500).send(`Error deleting Warehouse ${req.params.id} ${err}`)
    );
};
