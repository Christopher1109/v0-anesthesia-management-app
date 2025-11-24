# Generador de Hospitales y Usuarios

Este script genera automáticamente todos los hospitales y usuarios del sistema con sus credenciales.

## Requisitos

Las variables de entorno ya están configuradas en el proyecto:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Ejecución

### 1. Crear las tablas primero (si no existen)

Ejecuta el script SQL `003_create_hospitales_and_roles.sql` desde v0.

### 2. Generar hospitales y usuarios

\`\`\`bash
cd scripts
npm install
npm run generate
\`\`\`

### 3. Resultado

El script generará:
- Todos los hospitales en la tabla `hospitales`
- Usuarios con roles:
  - 1 auxiliar por hospital
  - 1 almacenista por hospital
  - 1 líder por hospital
  - Supervisores por estado (máximo 4 hospitales cada uno)
  - 1 gerente de operaciones con acceso a TODOS los hospitales
- Archivo `credenciales_generadas.json` con todas las credenciales

## Convención de credenciales

### Usuarios por hospital:
- Email: `{rol}.{estado}_{tipo}_{numero}@anestesia.imss.mx`
- Ejemplo: `auxiliar.baja_california_hgpmf_31@anestesia.imss.mx`

### Supervisores:
- Email: `supervisor.{estado}.{numero}@anestesia.imss.mx`
- Ejemplo: `supervisor.baja_california.1@anestesia.imss.mx`

### Gerente:
- Email: `gerente.operaciones@anestesia.imss.mx`

Las contraseñas se generan automáticamente y se guardan en el JSON.
