const knex = require("knex")(require("../knexfile"));
const { v4: uuid } = require("uuid");

//email validation
// const validRegex_email =
//   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// const validRegex_email =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const validRegex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// phone number validation WHAT DOES $ SIGN DO
const validRegex_phone = /\+1 \([0-9]{3}\) [0-9]{3}-[0-9]{4}$/;

exports.allWarehouses = (req, res) => {
	knex("warehouses")
		.select(
			"id",
			"warehouse_name",
			"address",
			"city",
			"country",
			"contact_name",
			"contact_position",
			"contact_phone",
			"contact_email"
		)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) =>
			res.status(400).send(`Error retrieving warehouse ${req.params.id} ${err}`)
		);
};

exports.singleWarehouse = (req, res) => {
	knex("warehouses")
		.select(
			"id",
			"warehouse_name",
			"address",
			"city",
			"country",
			"contact_name",
			"contact_position",
			"contact_phone",
			"contact_email"
		)
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

//PUT/EDIT Warehouse
exports.updateWarehouse = (req, res) => {
	// /\+1 \(365\) 888-2349/i
	//Valid phone format:+1 (123) 456-7890
	// Validate the request body for required data
	if (!Object.keys(req.body).length)
		return res.status(400).send("Please provide the entire json object");
	if (req.body.id != req.params.id)
		return res
			.status(400)
			.send(
				"The id in your provided json file does not match the id in your request url!"
			);
	if (
		!req.body.warehouse_name ||
		!req.body.city ||
		!req.body.country ||
		!req.body.contact_name ||
		!req.body.contact_position ||
		!req.body.address ||
		!req.body.contact_phone ||
		!req.body.contact_email
	) {
		return res
			.status(400)
			.send("Please make sure to provide all the required fields in a request");
	}
	if (!req.body.contact_email.match(validRegex_email)) {
		return res.status(400).send("Please make sure to provide a valid email");
	}
	if (!req.body.contact_phone.match(validRegex_phone)) {
		return res
			.status(400)
			.send("Please make sure to provide a valid phone number");
	}
	knex("warehouses")
		.update(req.body)
		.where({ id: req.params.id })
		.then((data) => {
			if (data) res.status(200).json(req.body);
			else
				res
					.status(404)
					.send(
						`Error updating Warehouse ${req.params.id} because no such id exists in the database.`
					);
		})
		.catch((err) =>
			res.status(404).send(`Error updating Warehouse ${req.params.id} ${err}`)
		);
};

exports.warehouseInventories = (req, res) => {
	knex("inventories")
		.select("id", "item_name", "category", "status", "quantity")
		.where({ warehouse_id: req.params.id })
		.then((data) => {
			if (data.length) res.status(200).json(data);
			else res.status(404).send("warehouse ID is not found");
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
		id: uuid(),
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

exports.deleteWarehouse = (req, res) => {
	knex("warehouses")
		.delete()
		.where({ id: req.params.id })
		.then((data) => {
			//WHY IS DATA A BINARY NUMBER (0 OR 1)
			console.log(data);
			// For DELETE response we can use 204 status code
			if (data) {
				res.status(204).send();
			} else {
				res
					.status(404)
					.send(`Warehouse with id: ${req.params.id} is not found`);
			}
		})
		.catch((err) =>
			res.status(500).send(`Error deleting Warehouse ${req.params.id} ${err}`)
		);
};
