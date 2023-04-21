const knex = require("knex")(require("../knexfile"));
const uniqueID = require("uniqid");

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
			res.status(200).json(data[0]);
		})
		.catch((err) =>
			res
				.status(404)
				.send(`message: error getting inventory item ${req.params.id}`)
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

exports.upsertItem = async (req, res) => {
	let { id } = req.params;
	let newItem = id === undefined; //if it's a new item, there won't be an id paramater

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

		//if it's an update, make sure the item exists, if not, create a new unique id
		if (!newItem) {
			let test = await knex("inventories").where("id", "asdf");
			console.log(test);
		} else {
			id = uniqueID();
		}

		// Upsert inventory item
		await knex("inventories")
			.insert({
				id,
				warehouse_id,
				item_name,
				description,
				category,
				status,
				quantity,
			})
			.onConflict("item_name")
			.merge();

		// Return the updated inventory item without created_at and updated_at
		const item = await knex("inventories")
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

		if (newItem) {
			res.status(201).json(item);
		} else {
			res.status(200).json(item);
		}
	} catch (err) {
		res.status(400).send(`Error updating inventory: ${err}`);
		console.error(err);
	}
};
