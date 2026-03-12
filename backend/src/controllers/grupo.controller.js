const pool = require("../config/db");

exports.crear = async (req, res) => {
  const { nombre, edad_minima, edad_maxima, horario } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO grupos (nombre, edad_minima, edad_maxima, horario)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [nombre, edad_minima, edad_maxima, horario || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando grupo" });
  }
};

exports.listar = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.id_grupo, g.nombre, g.edad_minima, g.edad_maxima, g.horario, 
              COALESCE(g.activo, true) as activo,
              COUNT(m.id_matricula) as total_estudiantes
       FROM grupos g
       LEFT JOIN matriculas m ON g.id_grupo = m.id_grupo AND m.estado = TRUE
       GROUP BY g.id_grupo, g.nombre, g.edad_minima, g.edad_maxima, g.horario, g.activo
       ORDER BY g.nombre`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error listando grupos" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT g.*, COUNT(m.id_matricula) as total_estudiantes
       FROM grupos g
       LEFT JOIN matriculas m ON g.id_grupo = m.id_grupo AND m.estado = TRUE
       WHERE g.id_grupo = $1
       GROUP BY g.id_grupo`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo grupo" });
  }
};
