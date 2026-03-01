const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../db');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// GET /api/usuarios - solo admin
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  const [rows] = await pool.query('SELECT id, nombre, user, role, creado_en FROM usuarios');
  res.json(rows);
});

// POST /api/usuarios - crear usuario
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const { nombre, user, pass, role } = req.body;
  if (!nombre || !user || !pass) return res.status(400).json({ error: 'Faltan campos requeridos' });

  try {
    const hash = await bcrypt.hash(pass, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, user, pass, role) VALUES (?, ?, ?, ?)',
      [nombre, user, hash, role || 'tecnico']
    );
    res.json({ id: result.insertId, nombre, user, role: role || 'tecnico' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Ese usuario ya existe' });
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// PUT /api/usuarios/:id - editar usuario
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { nombre, user, pass, role } = req.body;
  try {
    if (pass) {
      const hash = await bcrypt.hash(pass, 10);
      await pool.query('UPDATE usuarios SET nombre=?, user=?, pass=?, role=? WHERE id=?',
        [nombre, user, hash, role, req.params.id]);
    } else {
      await pool.query('UPDATE usuarios SET nombre=?, user=?, role=? WHERE id=?',
        [nombre, user, role, req.params.id]);
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// DELETE /api/usuarios/:id
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  if (req.params.id == 1) return res.status(400).json({ error: 'No puedes eliminar al admin principal' });
  await pool.query('DELETE FROM usuarios WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

module.exports = router;
