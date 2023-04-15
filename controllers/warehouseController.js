const knex = require('knex')(require('../knexfile'));
const validRegex_email = /^[a-zA-Z0-9.!#$%&'*+/=?^`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/;
const validRegex_phone = /\+1 \([0-9]{3}\) [0-9]{3}-[0-9]{3}/i;

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
      data_to_display = []
      console.log(data)
      data.forEach(e => {
        data_to_display.push(
          {
            id: e.id,
            item_name: e.item_name,
            category: e.category,
            status: e.status,
            quantity: e.quantity,
          }
        )}
      )
      res.status(200).json(data_to_display);
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

//PUT/EDIT Warehouse
exports.updateWarehouse = (req, res) => {
  // /\+1 \(365\) 888-2349/i
  //Valid phone format:+1 (123) 456-7890
  // Validate the request body for required data
  if(req.body.id != req.params.id)
    return res.status(400).send('The id in your provided json file does not match the id in your request url!');
  if (!req.body.warehouse_name || !req.body.city || !req.body.country || !req.body.contact_name || !req.body.contact_position || !req.body.address || !req.body.contact_phone || !req.body.contact_email) {
    return res.status(400).send('Please make sure to provide all the required fields in a request');
  }
  console.log(req.body.contact_email.match(validRegex_email));
  if(!req.body.contact_email.match(validRegex_email)){
    return res.status(400).send('Please make sure to provide a valid email');
  }
  if(!req.body.contact_phone.match(validRegex_phone)){
    return res.status(400).send('Please make sure to provide a valid phone number');
  }
  knex('warehouses')
    .update(req.body)
    .where({ id: req.params.id })
    .then((data) => {
      if(data)
        res.status(200).json(req.body);
      else
        res.status(404).send(`Error updating Warehouse ${req.params.id} because no such id exists in the database.`)
    })
    .catch((err) =>
      res.status(404).send(`Error updating Warehouse ${req.params.id} ${err}`)
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
