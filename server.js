const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

// rutas
const paisesRoutes = require("./routes/paises");

app.use("/paises", paisesRoutes);

app.listen(3000, () => {
  console.log("Servidor ejecutándose en puerto 3000");
});