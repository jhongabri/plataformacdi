const pool = require("../config/db");
const bcrypt = require("bcrypt");

exports.getAdminStats = async (req, res) => {
  try {
    const totalNinos = await pool.query(
      `SELECT COUNT(*) FROM ninos WHERE estado = true`
    );

    const totalDocentes = await pool.query(
      `SELECT COUNT(*) FROM usuarios WHERE id_rol = 2 AND estado = true`
    );

    const totalUsuarios = await pool.query(
      `SELECT COUNT(*) FROM usuarios WHERE estado = true`
    );

    res.json({
      totalNinos: parseInt(totalNinos.rows[0].count),
      totalDocentes: parseInt(totalDocentes.rows[0].count),
      totalUsuarios: parseInt(totalUsuarios.rows[0].count),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo estadísticas" });
  }
};

// ==========================================
// CREAR DOCENTE
// ==========================================
exports.createDocente = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        message: "Correo inválido"
      });
    }

    // Verificar si el correo ya existe
    const userExists = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "El correo ya está registrado"
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Rol 2 = Docente
    const id_rol = 2;

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password, id_rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id_usuario, nombre, correo, id_rol`,
      [nombre, correo, hashedPassword, id_rol]
    );

    const docente = result.rows[0];

    res.status(201).json({
      message: "Docente creado correctamente",
      docente
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// CREAR DOCENTE
// ==========================================
exports.createDocente = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return res.status(400).json({
        message: "Correo inválido"
      });
    }

    // Verificar si el correo ya existe
    const userExists = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        message: "El correo ya está registrado"
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Rol 2 = Docente
    const id_rol = 2;

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password, id_rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id_usuario, nombre, correo, id_rol`,
      [nombre, correo, hashedPassword, id_rol]
    );

    const docente = result.rows[0];

    res.status(201).json({
      message: "Docente creado correctamente",
      docente
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
