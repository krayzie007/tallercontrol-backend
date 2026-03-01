const router = require('express').Router();
const { pool } = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/ordenes
router.get('/', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT o.*, c.nombre as cliente_nombre, c.tel as cliente_tel, c.email as cliente_email
    FROM ordenes o
    LEFT JOIN clientes c ON o.cliente_id = c.id
    ORDER BY o.creado_en DESC
  `);
  res.json(rows);
});

// POST /api/ordenes
router.post('/', async (req, res) => {
  const { folio, cliente_id, equipo, falla, estado, fecha, costo, notas } = req.body;
  if (!equipo) return res.status(400).json({ error: 'Equipo requerido' });
  const [result] = await pool.query(
    'INSERT INTO ordenes (folio, cliente_id, equipo, falla, estado, fecha, costo, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [folio || '', cliente_id || null, equipo, falla || '', estado || 'Pendiente', fecha || null, costo || 0, notas || '']
  );
  res.json({ id: result.insertId, ...req.body });
});

// PUT /api/ordenes/:id
router.put('/:id', async (req, res) => {
  const { folio, cliente_id, equipo, falla, estado, fecha, costo, notas } = req.body;
  await pool.query(
    'UPDATE ordenes SET folio=?, cliente_id=?, equipo=?, falla=?, estado=?, fecha=?, costo=?, notas=? WHERE id=?',
    [folio || '', cliente_id || null, equipo, falla || '', estado || 'Pendiente', fecha || null, costo || 0, notas || '', req.params.id]
  );
  res.json({ ok: true });
});

// DELETE /api/ordenes/:id
router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM ordenes WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

// GET /api/ordenes/stats - para dashboard
router.get('/stats', async (req, res) => {
  const [[totales]] = await pool.query(`
    SELECT
      COUNT(*) as total,
      SUM(costo) as ingresos,
      SUM(CASE WHEN estado='Pendiente' THEN 1 ELSE 0 END) as pendientes,
      SUM(CASE WHEN estado='En proceso' THEN 1 ELSE 0 END) as en_proceso,
      SUM(CASE WHEN estado='Terminado' THEN 1 ELSE 0 END) as terminados
    FROM ordenes
  `);
  res.json(totales);
});

module.exports = router;
