const db = require("../config/db");

// Dashboard ADMIN
exports.dashboardAdmin = async (req, res) => {
  try {

    // 1️⃣ Total niños activos
    const ninos = await db.query(`
      SELECT COUNT(*) AS total 
      FROM ninos 
      WHERE estado = TRUE
    `);

    // 2️⃣ Total docentes (rol 2)
    const docentes = await db.query(`
      SELECT COUNT(*) AS total 
      FROM usuarios 
      WHERE id_rol = 2 AND estado = TRUE
    `);

    // 3️⃣ Total grupos activos
    const grupos = await db.query(`
      SELECT COUNT(*) AS total 
      FROM grupos
      WHERE activo = TRUE
    `);

    // 4️⃣ Porcentaje asistencia hoy
    const asistencia = await db.query(`
      SELECT 
        ROUND(
          (
            SUM(CASE WHEN estado = 'presente' THEN 1 ELSE 0 END)::decimal
            / NULLIF(COUNT(*),0)
          ) * 100
        ,2) AS porcentaje
      FROM asistencia
      WHERE fecha = CURRENT_DATE
    `);

    // 5️⃣ Ausencias por grupo hoy
    const ausencias = await db.query(`
      SELECT g.nombre AS grupo, COUNT(*) AS ausentes
      FROM asistencia a
      INNER JOIN matriculas m ON a.id_matricula = m.id_matricula
      INNER JOIN grupos g ON m.id_grupo = g.id_grupo
      WHERE a.estado = 'ausente'
      AND a.fecha = CURRENT_DATE
      GROUP BY g.nombre
    `);

    res.json({
      totalNinos: Number(ninos.rows[0].total),
      totalDocentes: Number(docentes.rows[0].total),
      totalGrupos: Number(grupos.rows[0].total),
      asistenciaHoy: Number(asistencia.rows[0]?.porcentaje) || 0,
      ausenciasPorGrupo: ausencias.rows
    });

  } catch (error) {
    console.error("Error Dashboard:", error);
    res.status(500).json({
      message: "Error al cargar dashboard"
    });
  }
};