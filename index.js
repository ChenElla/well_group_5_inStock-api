const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;

const warehouseRoutes = require("./routes/WarehouseRoute");
const inventoryRoutes = require("./routes/InventoryRoute");

app.use(express.json());

app.use("/inventories", inventoryRoutes);
app.use("/warehouses", warehouseRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
