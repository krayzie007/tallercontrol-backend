const router = require('express').Router();
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/clientes
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM clientes ORDER BY nombre');
  res.json(rows);
});

// POST /api/clientes
router.post('/', async (req, res) => {
  const { nombre, tel, email, notas } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
  const [result] = await pool.query(
    'INSERT INTO clientes (nombre, tel, email, notas) VALUES (?, ?, ?, ?)',
    [nombre, tel || '', email || '', notas || '']
  );
  res.json({ id: result.insertId, nombre, tel, email, notas });
});

// PUT /api/clientes/:id
router.put('/:id', async (req, res) => {
  const { nombre, tel, email, notas } = req.body;
  await pool.query('UPDATE clientes SET nombre=?, tel=?, email=?, notas=? WHERE id=?',
    [nombre, tel || '', email || '', notas || '', req.params.id]);
  res.json({ ok: true });
});

// DELETE /api/clientes/:id
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM clientes WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
