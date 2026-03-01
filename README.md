# TallerControl — Backend API

## Estructura
```
src/
  index.js          ← servidor principal
  db.js             ← conexión MySQL + tablas
  middleware/
    auth.js         ← verificación JWT
  routes/
    auth.js         ← POST /api/auth/login
    usuarios.js     ← CRUD usuarios (solo admin)
    clientes.js     ← CRUD clientes
    piezas.js       ← CRUD inventario
    ordenes.js      ← CRUD órdenes + stats
```

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/clientes | Listar clientes |
| POST | /api/clientes | Crear cliente |
| PUT | /api/clientes/:id | Editar cliente |
| DELETE | /api/clientes/:id | Eliminar cliente |
| GET | /api/piezas | Listar piezas |
| POST | /api/piezas | Crear pieza |
| PUT | /api/piezas/:id | Editar pieza |
| DELETE | /api/piezas/:id | Eliminar pieza |
| GET | /api/ordenes | Listar órdenes |
| POST | /api/ordenes | Crear orden |
| PUT | /api/ordenes/:id | Editar orden |
| DELETE | /api/ordenes/:id | Eliminar orden |
| GET | /api/ordenes/stats | Stats para dashboard |
| GET | /api/usuarios | Listar usuarios (admin) |
| POST | /api/usuarios | Crear usuario (admin) |
| PUT | /api/usuarios/:id | Editar usuario (admin) |
| DELETE | /api/usuarios/:id | Eliminar usuario (admin) |

---

## 🚀 Deploy en Railway (paso a paso)

### 1. Crear cuenta en Railway
- Ve a https://railway.app
- Crea cuenta con GitHub

### 2. Subir código a GitHub
```bash
git init
git add .
git commit -m "TallerControl backend"
git remote add origin https://github.com/TU_USUARIO/tallercontrol-backend.git
git push -u origin main
```

### 3. Crear proyecto en Railway
- Clic en **New Project**
- Selecciona **Deploy from GitHub repo**
- Elige tu repositorio

### 4. Agregar MySQL
- En tu proyecto Railway, clic **+ New**
- Selecciona **Database → MySQL**
- Railway crea la base de datos automáticamente

### 5. Conectar variables de entorno
- En tu servicio Node.js, ve a **Variables**
- Agrega estas variables (Railway las da al crear MySQL):
  ```
  DB_HOST     = (del plugin MySQL de Railway)
  DB_PORT     = (del plugin MySQL de Railway)
  DB_USER     = (del plugin MySQL de Railway)
  DB_PASSWORD = (del plugin MySQL de Railway)
  DB_NAME     = (del plugin MySQL de Railway)
  JWT_SECRET  = cualquier_texto_secreto_largo
  ```

### 6. Deploy automático
- Railway detecta el `package.json` y corre `npm start`
- En pocos minutos tendrás tu URL tipo:
  `https://tallercontrol-backend-production.up.railway.app`

### 7. Probar
Abre tu URL en el navegador, debe mostrar:
```json
{ "status": "TallerControl API corriendo ✅" }
```

---

## Usuario por defecto
- **Usuario:** admin
- **Contraseña:** admin123

⚠️ Cámbiala desde la app después del primer login.

## Correr en local
```bash
cp .env.example .env
# Edita .env con tus datos de MySQL local
npm install
npm run dev
```
