const router = require('express').Router();
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/piezas
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM piezas ORDER BY nombre');
  res.json(rows);
});

// POST /api/piezas
router.post('/', async (req, res) => {
  const { codigo, nombre, categoria, stock, stock_min, costo, notas } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
  const [result] = await pool.query(
    'INSERT INTO piezas (codigo, nombre, categoria, stock, stock_min, costo, notas) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [codigo || '', nombre, categoria || '', stock || 0, stock_min || 1, costo || 0, notas || '']
  );
  res.json({ id: result.insertId, ...req.body });
});

// PUT /api/piezas/:id
router.put('/:id', async (req, res) => {
  const { codigo, nombre, categoria, stock, stock_min, costo, notas } = req.body;
  await pool.query(
    'UPDATE piezas SET codigo=?, nombre=?, categoria=?, stock=?, stock_min=?, costo=?, notas=? WHERE id=?',
    [codigo || '', nombre, categoria || '', stock || 0, stock_min || 1, costo || 0, notas || '', req.params.id]
  );
  res.json({ ok: true });
});

// DELETE /api/piezas/:id
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM piezas WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
