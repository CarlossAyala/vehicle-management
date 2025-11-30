# 🧭 Módulo 1 — Onboarding (Especificación Funcional)

## 🎯 Objetivo

Guiar al usuario después del **primer login** para que pueda comenzar a usar el sistema de forma correcta y adaptada a su contexto:

- Crear tenant y vehículo si es un usuario nuevo.
- Mostrar dashboard o información contextual si ya pertenece a un tenant.
- Gestionar la selección de tenant activo si pertenece a varios.

## 🧍‍♂️ Tipos de Usuario en Onboarding

1. **Usuario nuevo** → Sin tenant asignado.
2. **Usuario invitado** → Sin tenant pero con una invitacion.  
3. **Usuario con un solo tenant** → Ya pertenece a un tenant.  
4. **Usuario con múltiples tenants** → Pertenece a más de un tenant.

## ⚙️ Reglas Generales del Onboarding

| Caso | Acción esperada | Navegación |
|------|----------------|------------|
| Usuario nuevo | Mostrar wizard de creación de tenant y primer vehículo | Redirigir al dashboard tras completar |
| Usuario invitado | Mostrar mensaje de bienvenida y rol en el tenant | Redirigir al dashboard del tenant, con permisos limitados según rol |
| Usuario con un solo tenant | Saltar wizard y mostrar dashboard directamente | Dashboard del tenant |
| Usuario con múltiples tenants | Mostrar selector de tenant activo | Dashboard del tenant seleccionado |

## 📝 Comportamiento Detallado

### 1️⃣ Usuario Nuevo (sin tenant)

- Detectar que `UserTenant` no existe para este usuario.
- Mostrar wizard con pasos:
  1. Seleccionar tipo de tenant (`personal` o `fleet`).
  2. Crear tenant con nombre y tipo.
  3. Crear primer vehículo (marca, modelo, año, placa, odómetro inicial).
- Validaciones:
  - Nombre de tenant obligatorio, mínimo 2 caracteres.
  - Vehículo: marca, modelo, año y placa obligatorios; odómetro >= 0.
- Navegación: al finalizar, ir al dashboard del tenant creado.

### 2️⃣ Usuario Invitado a Tenant Existente

- Detectar que `UserTenant` existe y el usuario no es `owner` del tenant.
- Mostrar mensaje de bienvenida, indicando:
  - Nombre del tenant.
  - Rol del usuario (ej. `driver` o `fleet_manager`).
- Validaciones:
  - Asegurar que el usuario tiene permisos según su rol.
- Navegación:
  - Redirigir al dashboard del tenant.
  - Limitar visibilidad y acciones según rol.

### 3️⃣ Usuario con un Solo Tenant

- Detectar que `UserTenant` existe y es el único.
- Navegación:
  - Redirigir directamente al dashboard del tenant.
- Validaciones:
  - Confirmar que el tenant está activo.
  - Cargar datos del dashboard según permisos.

### 4️⃣ Usuario con Múltiples Tenants

- Detectar que `UserTenant` tiene más de un registro.
- Mostrar **pantalla de selección de tenant activo**:
  - Lista de tenants con nombre y tipo.
  - Indicar rol del usuario en cada tenant.
- Validaciones:
  - Usuario debe seleccionar un tenant antes de continuar.
- Navegación:
  - Guardar tenant activo en sesión/cookie.
  - Redirigir al dashboard del tenant seleccionado.

## 🚨 Casos de Error / Edge Cases

- Usuario sin permisos → mostrar mensaje “No tienes acceso a este tenant”.
- Tenant eliminado mientras el usuario estaba inactivo → mostrar mensaje “Este tenant ya no está disponible”.
- Error de conexión al servidor → mostrar mensaje “No se pudo conectar, intenta más tarde”.

## 📱 Flujo de Navegación General

Primer Login

```bash
│
├─> Usuario Nuevo ──> Wizard → Crear Tenant → Crear Vehículo → Dashboard
│
├─> Usuario Invitado ──> Mensaje Bienvenida → Dashboard (permiso limitado)
│
├─> Usuario con un Solo Tenant ──> Dashboard
│
└─> Usuario con Múltiples Tenants ──> Selección Tenant → Dashboard
```

## ✅ Criterios de Aceptación

- Todos los usuarios deben aterrizar en el dashboard correspondiente después del Onboarding.
- Los permisos y visibilidad deben respetar el rol del usuario en cada tenant.
- El wizard solo aparece para usuarios sin tenant.
- Los mensajes de bienvenida deben mostrar correctamente el nombre del tenant y el rol del usuario.
- La sesión debe recordar el tenant activo para futuras visitas.
