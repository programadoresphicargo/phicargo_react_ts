# Phides Client

Sistema de gestión operativa para Phicargo, desarrollado con React y TypeScript. Esta aplicación proporciona una interfaz moderna y eficiente para la gestión integral de operaciones de transporte.

## 📋 Características Principales

- **Gestión de Turnos**: Control y administración de turnos operativos
- **Gestión de Operadores**: Administración del personal operativo
- **Control de Viajes**: Seguimiento y gestión de viajes
- **Gestión de Vehículos**: Administración de la flota
- **Reportes Informativos**: Generación de informes y estadísticas
- **Control de Usuarios**: Administración de accesos y permisos

## 🔧 Requisitos Previos

- Node.js 20.x o superior
- yarn o npm
- Git

## 🚀 Tecnologías Principales

- React 18
- TypeScript
- TanStack Query
- FastAPI (Backend)
- Odoo CRM (Sistema de gestión empresarial)

## ⚙️ Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/programadoresphicargo/phicargo_react_ts.git

cd phides-client
```

2. Instalar dependencias:
```bash
# Usando yarn
yarn install

# O usando npm
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.template .env
```
Editar el archivo `.env` con las configuraciones necesarias.

## 🏃‍♂️ Ejecutar la Aplicación

```bash
# Modo desarrollo con yarn
yarn dev

# O con npm
npm run dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que se configure).

## 🔌 Integración con Backend

Este cliente se comunica con una API desarrollada en Python/FastAPI que a su vez se integra con Odoo CRM. Asegúrate de tener configuradas las URLs correctas en el archivo de environment.

## 📝 Convenciones de Código

- Utilizar TypeScript para todo el código nuevo
- Seguir las guías de estilo de ESLint configuradas en el proyecto
- Documentar componentes y funciones principales
- Mantener los componentes modulares y reutilizables

## 📚 Documentación Adicional

Para más información sobre las APIs y servicios relacionados:
- [Documentación de la API (FastAPI)]()
