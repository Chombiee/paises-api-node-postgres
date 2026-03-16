# Backend + Frontend Países (Node.js + PostgreSQL)

Aplicación que permite administrar información de países utilizando **Node.js, Express y PostgreSQL** en el backend y un **frontend básico en HTML, CSS y JavaScript**.

El sistema permite consultar países con su información económica, agregar nuevos registros y eliminar países, utilizando transacciones y manejo de errores.

---

## Tecnologías utilizadas

### Backend
- Node.js
- Express
- PostgreSQL
- pg
- pg-cursor
- dotenv
- cors

### Frontend
- HTML
- CSS
- JavaScript (Fetch API)

---

## Funcionalidades

### Backend

- Obtener lista de países con:
  - nombre
  - continente
  - población
  - PIB 2019
  - PIB 2020

- Agregar un nuevo país (POST)

- Eliminar un país (DELETE)

- Manejo de **transacciones (commit / rollback)**

- Manejo de **errores del servidor**

- Uso de **cursor para lectura en bloques**

---

### Frontend

El frontend permite interactuar con el backend mediante:

- Visualización de países en tabla
- Selección de cantidad de registros (5, 10 o 20)
- Botón para avanzar en los resultados
- Botón para retroceder en los resultados
- Ordenar la tabla por columnas
- Formulario para agregar países
- Formulario para eliminar países
- Confirmación antes de eliminar
- Mensajes de error y éxito enviados por el backend

---

## Instalación

### 1. Clonar repositorio

```
git clone URL_DEL_REPOSITORIO
```

### 2. Entrar al proyecto

```
cd nombre-del-proyecto
```

### 3. Instalar dependencias

```
npm install
```

### 4. Crear archivo `.env`

Crear un archivo `.env` en la raíz del proyecto con la configuración de la base de datos:

```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_DATABASE=nombre_base
DB_PORT=5432
```

### 5. Ejecutar servidor

```
node server.js
```

El backend se ejecutará en:

```
http://localhost:3000
```

---

## Endpoints

### Obtener países

```
GET /paises
```

Devuelve la lista de países con:

- nombre
- continente
- población
- PIB 2019
- PIB 2020

---

### Agregar país

```
POST /paises
```

Ejemplo body:

```
{
  "nombre": "PaisEjemplo",
  "continente": "America",
  "poblacion": 1000000,
  "pib_2019": 50000,
  "pib_2020": 52000
}
```

---

### Eliminar país

```
DELETE /paises/:nombre
```

Ejemplo:

```
DELETE /paises/Chile
```

---
