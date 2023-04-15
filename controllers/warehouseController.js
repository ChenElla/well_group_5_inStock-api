const knex = require("knex")(require("../knexfile"));
const uniqueID = require("uniqid");

//email validation
// const validRegex_email =
//   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const validRegex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// phone number validation
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
  knex("inventories")
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
  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    return res
      .status(400)
      .send(
        "Please make sure to provide name, manager, address, phone and email fields in a request"
      );
  }
  console.log(req.body);
  if (!req.body.contact_email.match(validRegex_email)) {
    return res.status(400).send("Please make sure to provide a valid email");
  }
  if (!req.body.contact_phone.match(validRegex_phone)) {
    return res
      .status(400)
      .send("Please make sure to provide a valid phone number");
  }
  const newWarehouse = {
    id: uniqueID(),
    warehouse_name: req.body.warehouse_name,
    address: req.body.address,
    city: req.body.city,
    country: req.body.country,
    contact_name: req.body.contact_name,
    contact_position: req.body.contact_position,
    contact_phone: req.body.contact_phone,
    contact_email: req.body.contact_email,
  };

  knex("warehouses")
    .insert(newWarehouse)
    .then((data) => {
      // For POST requests we need to respond with 201 and the location of the newly created record
      // const newWarehouseURL = `/warehouses/${data[0]}`;
      res.status(201).json(newWarehouse);
    })
    .catch((err) => res.status(400).send(`Error creating Warehouse: ${err}`));
};

exports.updateWarehouse = (req, res) => {
  knex("warehouses")
    .update(req.body)
    .where({ id: req.params.id })
    .then(() => {
      res
        .status(200)
        .send(`Warehouse with id: ${req.params.id} has been updated`);
    })
    .catch((err) =>
      res.status(400).send(`Error updating Warehouse ${req.params.id} ${err}`)
    );
};

exports.updateWarehouse = (req, res) => {
  knex("warehouses")
    .update(req.body)
    .where({ id: req.params.id })
    .then(() => {
      res
        .status(200)
        .send(`Warehouse with id: ${req.params.id} has been updated`);
    })
    .catch((err) =>
      res.status(500).send(`Error updating Warehouse ${req.params.id} ${err}`)
    );
};

exports.deleteWarehouse = (req, res) => {
  knex("warehouses")
    .delete()
    .where({ id: req.params.id })
    .then(() => {
      // For DELETE response we can use 204 status code
      res
        .status(204)
        .send(`Warehouse with id: ${req.params.id} has been deleted`);
    })
    .catch((err) =>
      res.status(500).send(`Error deleting Warehouse ${req.params.id} ${err}`)
    );
};
