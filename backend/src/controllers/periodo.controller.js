exports.crear = async (req, res) => {
  const { nombre, fecha_inicio, fecha_fin } = req.body;

  const result = await pool.query(
    `INSERT INTO periodos (nombre, fecha_inicio, fecha_fin)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [nombre, fecha_inicio, fecha_fin]
  );

  res.status(201).json(result.rows[0]);
};