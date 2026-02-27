exports.crear = async (req, res) => {
  const { nombre, edad_minima, edad_maxima } = req.body;

  const result = await pool.query(
    `INSERT INTO grupos (nombre, edad_minima, edad_maxima)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [nombre, edad_minima, edad_maxima]
  );

  res.status(201).json(result.rows[0]);
};