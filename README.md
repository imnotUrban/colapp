# ColApp Backend

Backend para la aplicación colaborativa de servicios ColApp, desarrollado con Express.js y MongoDB.

## Requisitos

- Node.js (v14 o superior)
- MongoDB
- npm o yarn

## Instalación

1. Clona este repositorio:
\`\`\`bash
git clone https://github.com/tu-usuario/colapp-backend.git
cd colapp-backend
\`\`\`

2. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

3. Crea un archivo `.env` basado en `.env.example` y configura tus variables de entorno:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Inicia el servidor:
\`\`\`bash
npm run dev
\`\`\`

El servidor estará disponible en http://localhost:5000

## Estructura del Proyecto

\`\`\`
colapp-backend/
├── controllers/       # Controladores de la aplicación
├── middleware/        # Middleware personalizado
├── models/            # Modelos de MongoDB
├── routes/            # Rutas de la API
├── uploads/           # Directorio para archivos subidos
├── .env               # Variables de entorno
├── .env.example       # Ejemplo de variables de entorno
├── package.json       # Dependencias y scripts
├── README.md          # Documentación
└── server.js          # Punto de entrada de la aplicación
\`\`\`

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar un nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (protegido)

### Usuarios
- `GET /api/users/profile/:username` - Obtener perfil de usuario
- `PUT /api/users/profile` - Actualizar perfil (protegido)
- `PATCH /api/users/profile/images` - Actualizar avatar o banner (protegido)
- `GET /api/users/wallet` - Obtener balance de la billetera (protegido)
- `POST /api/users/wallet/transfer` - Transferir fondos pendientes (protegido)
- `POST /api/users/wallet/withdraw` - Retirar fondos (protegido)

### Servicios
- `GET /api/services` - Obtener todos los servicios (con filtros)
- `GET /api/services/:id` - Obtener un servicio por ID
- `POST /api/services` - Crear un nuevo servicio (protegido)
- `PUT /api/services/:id` - Actualizar un servicio (protegido)
- `DELETE /api/services/:id` - Eliminar un servicio (protegido)
- `PATCH /api/services/:id/status` - Cambiar estado de un servicio (protegido)
- `GET /api/services/provider/:providerId` - Obtener servicios por proveedor
- `GET /api/services/user/me` - Obtener mis servicios (protegido)

### Reservas
- `POST /api/bookings` - Crear una nueva reserva (protegido)
- `GET /api/bookings/me/client` - Obtener mis reservas como cliente (protegido)
- `GET /api/bookings/me/provider` - Obtener mis reservas como proveedor (protegido)
- `GET /api/bookings/:id` - Obtener una reserva por ID (protegido)
- `PATCH /api/bookings/:id/status` - Actualizar estado de una reserva (protegido)
- `PATCH /api/bookings/:id/cancel` - Cancelar una reserva (protegido)

### Reseñas
- `POST /api/reviews` - Crear una nueva reseña (protegido)
- `GET /api/reviews/service/:serviceId` - Obtener reseñas de un servicio
- `GET /api/reviews/provider/:providerId` - Obtener reseñas de un proveedor
- `GET /api/reviews/me` - Obtener mis reseñas (protegido)
- `DELETE /api/reviews/:id` - Eliminar una reseña (protegido)

## Licencia

MIT
