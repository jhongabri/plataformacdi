const pool = require("../config/db");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");

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
// OBTENER TODOS LOS DOCENTES
// ==========================================
exports.getAllDocentes = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, u.id_rol, u.estado, u.id_grupo, g.nombre as nombre_grupo
       FROM usuarios u
       LEFT JOIN grupos g ON u.id_grupo = g.id_grupo
       WHERE u.id_rol = 2
       ORDER BY u.nombre`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo docentes" });
  }
};

// ==========================================
// OBTENER TODOS LOS GRUPOS (usar grupo controller ahora)
// ==========================================
exports.getAllGrupos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_grupo, nombre, edad_minima, edad_maxima, activo 
       FROM grupos 
       WHERE activo = TRUE 
       ORDER BY nombre`
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo grupos" });
  }
};

// ==========================================
// OBTENER ESTUDIANTES DE UN GRUPO (para admin)
// ==========================================
exports.getEstudiantesPorGrupo = async (req, res) => {
  try {
    const { id } = req.params;

    const estudiantesResult = await pool.query(
      `SELECT m.id_matricula, n.id_nino, n.nombres, n.apellidos, n.documento as codigo,
              n.fecha_nacimiento, 
              EXTRACT(YEAR FROM age(CURRENT_DATE, n.fecha_nacimiento)) as edad
       FROM matriculas m
       INNER JOIN ninos n ON m.id_nino = n.id_nino
       WHERE m.id_grupo = $1 AND m.estado = TRUE
       ORDER BY n.nombres, n.apellidos`,
      [id]
    );

    res.json({
      estudiantes: estudiantesResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo estudiantes del grupo" });
  }
};

// ==========================================
// IMPORTAR ESTUDIANTES ADMIN PARA GRUPO ESPECIFICO
// ==========================================
exports.importarEstudiantesAdmin = async (req, res) => {
  try {
    const idGrupo = req.body.id_grupo;

    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo Excel" });
    }

    if (!idGrupo) {
      return res.status(400).json({ message: "ID del grupo es requerido" });
    }

    // Verificar grupo existe
    const grupoCheck = await pool.query("SELECT id_grupo FROM grupos WHERE id_grupo = $1", [idGrupo]);
    if (grupoCheck.rows.length === 0) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    // Leer Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ message: "Archivo Excel vacío" });
    }

    // NO requerir periodo activo (opcional o null)
    let idPeriodo = req.body.id_periodo || null;

    const resultados = { creados: 0, existentes: 0, errores: [] };

    for (const row of data) {
      try {
        const nombres = row.nombre || row.nombres || "";
        const apellidos = row.apellido || row.apellidos || "";
        const codigo = row.codigo || row.documento || null;
        const edad = parseInt(row.edad);

        if (!nombres || !apellidos || !edad || edad <= 0) {
          resultados.errores.push(`Fila inválida: ${JSON.stringify(row)}`);
          continue;
        }

        // Compute fecha_nacimiento from edad
        const fechaNacimiento = new Date();
        fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - edad);
        const fechaStr = fechaNacimiento.toISOString().split('T')[0];

        // Check existing nino by codigo or nombres+fecha
        let existingNino = codigo ? await pool.query(`SELECT id_nino FROM ninos WHERE documento = $1`, [codigo]) : null;
        if (!existingNino || existingNino.rows.length === 0) {
          existingNino = await pool.query(
            `SELECT id_nino FROM ninos WHERE nombres ILIKE $1 AND apellidos ILIKE $2 AND fecha_nacimiento = $3`,
            [nombres, apellidos, fechaStr]
          );
        }

        let idNino;
        if (existingNino && existingNino.rows.length > 0) {
          idNino = existingNino.rows[0].id_nino;
          resultados.existentes++;
        } else {
          const ninoResult = await pool.query(
            `INSERT INTO ninos (nombres, apellidos, fecha_nacimiento, documento, estado)
             VALUES ($1, $2, $3, $4, TRUE) RETURNING id_nino`,
            [nombres, apellidos, fechaStr, codigo]
          );
          idNino = ninoResult.rows[0].id_nino;
          resultados.creados++;
        }

        // Check matricula existing
        const existingMatricula = await pool.query(
          `SELECT id_matricula FROM matriculas WHERE id_nino = $1 AND id_grupo = $2${idPeriodo ? ' AND id_periodo = $3' : ''}`,
          idPeriodo ? [idNino, idGrupo, idPeriodo] : [idNino, idGrupo]
        );

        if (existingMatricula.rows.length === 0) {
          await pool.query(
            `INSERT INTO matriculas (id_nino, id_grupo${idPeriodo ? ', id_periodo' : ''}, fecha_matricula, estado)
             VALUES ($1, $2${idPeriodo ? ', $3' : ''}, CURRENT_DATE, TRUE)`,
            idPeriodo ? [idNino, idGrupo, idPeriodo] : [idNino, idGrupo]
          );
        }

      } catch (err) {
        resultados.errores.push(`Error fila: ${err.message}`);
      }
    }

    res.json({ message: "Importación completada", resultados });
  } catch (error) {
    console.error("Error import admin:", error);
    res.status(500).json({ message: "Error importando estudiantes" });
  }
};

// ==========================================
// ASIGNAR GRUPO A DOCENTE
// ==========================================
exports.asignarGrupoDocente = async (req, res) => {
  try {
    const { id_docente, id_grupo } = req.body;

    if (!id_docente) {
      return res.status(400).json({ message: "ID del docente es requerido" });
    }

    // Verificar que el docente exista
    const docenteExists = await pool.query(
      "SELECT id_usuario, nombre FROM usuarios WHERE id_usuario = $1 AND id_rol = 2",
      [id_docente]
    );

    if (docenteExists.rows.length === 0) {
      return res.status(404).json({ message: "Docente no encontrado" });
    }

    // Verificar que el grupo exista (si se proporciona)
    if (id_grupo) {
      const grupoExists = await pool.query(
        "SELECT id_grupo FROM grupos WHERE id_grupo = $1",
        [id_grupo]
      );

      if (grupoExists.rows.length === 0) {
        return res.status(404).json({ message: "Grupo no encontrado" });
      }
    }

    // Actualizar el grupo del docente
    const result = await pool.query(
      `UPDATE usuarios 
       SET id_grupo = $1 
       WHERE id_usuario = $2 
       RETURNING id_usuario, nombre, id_grupo`,
      [id_grupo || null, id_docente]
    );

    res.json({
      message: id_grupo ? "Grupo asignado correctamente" : "Grupo removido correctamente",
      docente: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error asignando grupo" });
  }
};
