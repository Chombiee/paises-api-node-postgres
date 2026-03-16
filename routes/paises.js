const express = require("express");
const router = express.Router();

const pool = require("../db");
const Cursor = require("pg-cursor");

router.get("/", async (req, res) => {

  const client = await pool.connect();

  try {

    const query = `
      SELECT
      p.nombre,
      p.continente,
      p.poblacion,
      pp.pib_2019,
      pp.pib_2020
      FROM paises p
      JOIN paises_pib pp
      ON p.nombre = pp.nombre
    `;

    const cursor = client.query(new Cursor(query));

    const resultados = [];

    function leerBloque() {

      // lee 5 registros por bloque
      cursor.read(5, (err, rows) => {

        if (err) {
          console.error(err);
          client.release();
          return res.status(500).json({ error: "Error leyendo cursor" });
        }

        if (rows.length === 0) {

          cursor.close(() => {
            client.release();
            res.json(resultados);
          });

        } else {

          resultados.push(...rows);
          leerBloque();

        }

      });

    }

    leerBloque();

  } catch (error) {

    client.release();

    res.status(500).json({
      error: "Error al obtener países",
      detalle: error.message
    });

  }

});

router.post("/", async (req, res) => {

  const { nombre, continente, poblacion, pib_2019, pib_2020 } = req.body;

  // VALIDACIÓN
  if (!nombre || !continente || !poblacion || !pib_2019 || !pib_2020) {
    return res.status(400).json({
      error: "Faltan datos obligatorios"
    });
  }

  if (isNaN(poblacion) || isNaN(pib_2019) || isNaN(pib_2020)) {
    return res.status(400).json({
      error: "Los valores numéricos no son válidos"
    });
  }

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // insertar país
    await client.query(
      "INSERT INTO paises(nombre, continente, poblacion) VALUES($1,$2,$3)",
      [nombre, continente, poblacion]
    );

    // insertar pib
    await client.query(
      "INSERT INTO paises_pib(nombre, pib_2019, pib_2020) VALUES($1,$2,$3)",
      [nombre, pib_2019, pib_2020]
    );

    // intentar registrar acción web
    try {

      await client.query(
        "INSERT INTO paises_data_web(nombre_pais, accion) VALUES($1,1)",
        [nombre]
      );

    } catch (error) {

      console.log("No se pudo registrar acción web");

    }

    await client.query("COMMIT");

    res.json({
      mensaje: "País agregado correctamente"
    });

  } catch (error) {

    await client.query("ROLLBACK");

    res.status(500).json({
      error: "Error al insertar país",
      detalle: error.message
    });

  } finally {

    client.release();

  }

});

router.delete("/:nombre", async (req, res) => {

  const { nombre } = req.params;

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // verificar existencia
    const existe = await client.query(
      "SELECT * FROM paises WHERE nombre=$1",
      [nombre]
    );

    if (existe.rows.length === 0) {

      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "El país no existe"
      });

    }

    // eliminar pib
    await client.query(
      "DELETE FROM paises_pib WHERE nombre=$1",
      [nombre]
    );

    // eliminar país
    await client.query(
      "DELETE FROM paises WHERE nombre=$1",
      [nombre]
    );

    // registrar acción
    try {

      await client.query(
        "INSERT INTO paises_data_web(nombre_pais, accion) VALUES($1,0)",
        [nombre]
      );

    } catch (error) {

      console.log("No se pudo registrar acción web");

    }

    await client.query("COMMIT");

    res.json({
      mensaje: "País eliminado correctamente"
    });

  } catch (error) {

    await client.query("ROLLBACK");

    res.status(500).json({
      error: "Error al eliminar",
      detalle: error.message
    });

  } finally {

    client.release();

  }

});

module.exports = router;