const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;

const warehouseRoutes = require("./routes/WarehouseRoute.js");
const inventoryRoutes = require("./routes/InventoryRoute.js");

app.use(express.json());
const cors = require("cors");
app.use(
	cors({
		origin: "*",
	})
);
app.use("/inventories", inventoryRoutes);
app.use("/warehouses", warehouseRoutes);

app.listen(PORT, () => {
	console.log(`running at http://localhost:${PORT}`);
});
