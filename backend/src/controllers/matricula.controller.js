exports.crear = async (req, res) => {
  const { id_nino, id_grupo, id_periodo } = req.body;

  const result = await pool.query(
    `INSERT INTO matriculas (id_nino, id_grupo, id_periodo)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [id_nino, id_grupo, id_periodo]
  );

  res.status(201).json(result.rows[0]);
};