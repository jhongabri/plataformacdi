const pool = require("../config/db");

// Crear niño
exports.crearNino = async (req, res) => {
  try {
    const { nombres, apellidos, fecha_nacimiento, documento } = req.body;

    const result = await pool.query(
      `INSERT INTO ninos (nombres, apellidos, fecha_nacimiento, documento)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nombres, apellidos, fecha_nacimiento, documento]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos
exports.obtenerNinos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM ninos
      WHERE estado = true
      ORDER BY fecha_registro DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};