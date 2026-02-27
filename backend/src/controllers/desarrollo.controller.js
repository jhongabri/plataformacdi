exports.registrar = async (req, res) => {
  const { id_matricula, fecha, dimension, nivel_logro, observacion } = req.body;

  const result = await pool.query(
    `INSERT INTO desarrollo_infantil
     (id_matricula, fecha, dimension, nivel_logro, observacion, registrado_por)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [
      id_matricula,
      fecha,
      dimension,
      nivel_logro,
      observacion,
      req.user.id_usuario,
    ]
  );

  res.status(201).json(result.rows[0]);
};