const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

async function initDB() {
  const conn = await pool.getConnection();
  try {
    // Usuarios
    await conn.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        user VARCHAR(50) NOT NULL UNIQUE,
        pass VARCHAR(255) NOT NULL,
        role ENUM('admin','tecnico') DEFAULT 'tecnico',
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clientes
    await conn.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        tel VARCHAR(20),
        email VARCHAR(100),
        notas TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Piezas / Inventario
    await conn.query(`
      CREATE TABLE IF NOT EXISTS piezas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(50),
        nombre VARCHAR(100) NOT NULL,
        categoria VARCHAR(50),
        stock INT DEFAULT 0,
        stock_min INT DEFAULT 1,
        costo DECIMAL(10,2) DEFAULT 0,
        notas TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Órdenes
    await conn.query(`
      CREATE TABLE IF NOT EXISTS ordenes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        folio VARCHAR(50),
        cliente_id INT,
        equipo VARCHAR(100) NOT NULL,
        falla TEXT,
        estado ENUM('Pendiente','En proceso','Terminado') DEFAULT 'Pendiente',
        fecha DATE,
        costo DECIMAL(10,2) DEFAULT 0,
        notas TEXT,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL
      )
    `);

    // Insertar admin por defecto si no existe
    const bcrypt = require('bcryptjs');
    const [rows] = await conn.query('SELECT id FROM usuarios WHERE user = ?', ['admin']);
    if (rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10);
      await conn.query(
        'INSERT INTO usuarios (nombre, user, pass, role) VALUES (?, ?, ?, ?)',
        ['Administrador', 'admin', hash, 'admin']
      );
      console.log('✅ Usuario admin creado: admin / admin123');
    }

    console.log('✅ Base de datos lista');
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };
