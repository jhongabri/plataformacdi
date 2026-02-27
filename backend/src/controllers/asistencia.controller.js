exports.registrar = async (req, res) => {
  const { id_matricula, fecha, estado, observacion } = req.body;

  const result = await pool.query(
    `INSERT INTO asistencia
     (id_matricula, fecha, estado, observacion, registrado_por)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [id_matricula, fecha, estado, observacion, req.user.id_usuario]
  );

  res.status(201).json(result.rows[0]);
};