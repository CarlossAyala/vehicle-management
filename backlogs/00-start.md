# 🧭 Vehicle Management System — Backlog Funcional (Post-Login)

## 🎯 Contexto General

Una vez que el usuario inicia sesión correctamente, accede a su **espacio de trabajo (tenant)**, donde podrá gestionar vehículos, operaciones y reportes.  
Dependiendo del tipo de tenant (`personal` o `fleet`), la experiencia y permisos variarán.

---

## 🚪 1. Primer Ingreso / Onboarding

### Historia de Usuario

**Como** usuario nuevo,  
**quiero** configurar mi tenant y mi primer vehículo,  
**para** comenzar a registrar mis operaciones de forma organizada.

### Requerimientos Funcionales

- Verificar si el usuario tiene un `tenant` asignado.
- Si no tiene, mostrar un **wizard** para crear uno:
  - Seleccionar tipo: `personal` o `fleet`.
  - Ingresar nombre del tenant.
  - Crear tenant y asociar al usuario como `owner`.
- Permitir crear el **primer vehículo** con datos básicos:
  - `brand`, `model`, `year`, `plate`, `odometer`.
- Ofrecer la opción de registrar categorías personalizadas (opcional).

### Criterios de Aceptación

- El usuario no puede avanzar sin tener al menos un `tenant`.
- Después de crear el primer vehículo, el sistema redirige al dashboard principal.

---

## 🚗 2. Dashboard Principal

### Historia de Usuario

**Como** usuario autenticado,  
**quiero** ver un resumen general de mis vehículos y métricas clave,  
**para** entender rápidamente el estado y rendimiento de mi flota o vehículo personal.

### Requerimientos Funcionales

- Mostrar lista de **vehículos** asociados al tenant.
- Mostrar resumen de métricas por vehículo:
  - Último odómetro.
  - Última carga de combustible.
  - Último mantenimiento.
  - Costo total acumulado.
- Mostrar resumen general del tenant (total de gastos, ingresos, km, consumo, etc.).
- Acceso rápido a registrar una nueva operación (`+`).

### Criterios de Aceptación

- El dashboard se actualiza automáticamente después de registrar una nueva operación.
- Los datos se agrupan correctamente por `tenant`.

---

## ⚙️ 3. Gestión de Vehículos

### Historia de Usuario

**Como** usuario,  
**quiero** crear, editar y eliminar vehículos,  
**para** mantener mi flota o autos personales actualizados.

### Requerimientos Funcionales

- CRUD de vehículos.
- Asociar cada vehículo al `tenant`.
- Permitir imagen o avatar del vehículo.
- Mostrar historial completo de operaciones asociadas a un vehículo.

### Criterios de Aceptación

- No se pueden eliminar vehículos con operaciones asociadas (debe confirmarse o archivarse).
- El historial se muestra ordenado cronológicamente.

---

## ⛽ 4. Módulo de Combustible (Refueling)

### Historia de Usuario

**Como** usuario,  
**quiero** registrar cargas de combustible,  
**para** controlar mi gasto y consumo promedio.

### Requerimientos Funcionales

- Crear operación tipo `fuel` vinculada a un `vehicle` y `tenant`.
- Campos: `fuel_type`, `volume`, `cost`, `odometer`, `full_tank`.
- Calcular consumo promedio (km/L) si existen lecturas de odómetro previas.
- Mostrar historial de cargas.
- Reporte de gasto total y costo promedio por litro.

### Criterios de Aceptación

- La operación debe generar automáticamente un registro de `odometer` si se incluye la lectura.
- El cálculo de consumo se realiza solo cuando hay dos o más registros válidos.

---

## 🧰 5. Módulo de Servicios / Mantenimientos

### Historia de Usuario

**Como** usuario,  
**quiero** registrar mantenimientos preventivos o correctivos,  
**para** llevar un control detallado de los servicios de mi vehículo.

### Requerimientos Funcionales

- Crear operación tipo `service`.
- Asociar múltiples `service_items` con:
  - `description`, `category`, `amount`.
- Mostrar historial de servicios realizados.
- Calcular gasto total por categoría (ej. aceite, frenos, etc.).
- Posibilidad de adjuntar notas o facturas (opcional).

### Criterios de Aceptación

- No se permiten `service` sin ítems asociados.
- El total del servicio se calcula sumando los montos de los ítems.

---

## 💵 6. Módulo de Transacciones (Expenses / Incomes)

### Historia de Usuario

**Como** usuario,  
**quiero** registrar gastos o ingresos asociados a mis vehículos,  
**para** mantener un control financiero completo.

### Requerimientos Funcionales

- Crear operación tipo `transaction`.
- Campos principales: `type (expense/income)`, `total_amount`, `description`.
- Asociar múltiples `transaction_items` con:
  - `amount`, `description`, `category`.
- Filtrar por tipo y rango de fechas.
- Mostrar gráficos de gasto por categoría.

### Criterios de Aceptación

- El total de la transacción debe coincidir con la suma de sus ítems.
- Las categorías deben corresponder al tipo de transacción (`expense` o `income`).

---

## 🧮 7. Módulo de Odometer

### Historia de Usuario

**Como** usuario,  
**quiero** registrar lecturas del odómetro,  
**para** seguir el kilometraje y calcular consumos y mantenimientos.

### Requerimientos Funcionales

- Registrar lecturas manuales del odómetro.
- Asociar lecturas automáticas desde operaciones (`fuel`, `service`).
- Mostrar gráfico de evolución del kilometraje.

### Criterios de Aceptación

- No se pueden registrar valores menores al último odómetro.
- El gráfico debe mostrar la progresión de manera cronológica.

---

## 👥 8. Gestión de Usuarios (solo para tenants tipo Fleet)

### Historia de Usuario

**Como** administrador de una flota,  
**quiero** invitar y gestionar usuarios con distintos roles,  
**para** asignar permisos y responsabilidades.

### Requerimientos Funcionales

- Invitar usuarios por email.
- Asignar roles (`fleet_manager`, `driver`, `admin`).
- Ver y gestionar lista de miembros.
- Controlar acceso a operaciones según el rol.

### Criterios de Aceptación

- Solo el `owner` o `admin` puede invitar o cambiar roles.
- Cada usuario ve únicamente los vehículos y operaciones permitidas por su rol.

---

## 📊 9. Reportes y Estadísticas

### Historia de Usuario

**Como** usuario,  
**quiero** visualizar reportes y métricas consolidadas,  
**para** analizar el rendimiento y costos de mis vehículos o flota.

### Requerimientos Funcionales

- Reportes por vehículo o tenant:
  - `Cost per km`
  - `Expenses by category`
  - `Maintenance cost`
  - `Total cost per vehicle`
- Gráficos y comparativas por rango de fechas.
- Exportar datos a CSV o PDF (futuro).

### Criterios de Aceptación

- Los reportes deben considerar todas las operaciones del rango seleccionado.
- Los cálculos deben excluir registros incompletos o inválidos.

---

## 🔔 10. Recordatorios y Checklist *(Próximo)*

### Historia de Usuario

**Como** usuario,  
**quiero** crear recordatorios por fecha o kilometraje,  
**para** anticipar mantenimientos o pagos.

### Requerimientos Funcionales

- Crear recordatorios con tipo (`by_date`, `by_odometer`).
- Notificación o aviso cuando se alcance la condición.
- Checklist de revisión preventiva (fluido, neumáticos, luces, etc.).

### Criterios de Aceptación

- Los recordatorios deben mostrar el estado (`pending`, `done`, `expired`).
- El sistema debe notificar al usuario al alcanzar el umbral definido.

---

## ⚙️ 11. Configuración del Usuario

### Historia de Usuario

**Como** usuario,  
**quiero** actualizar mi información personal y preferencias,  
**para** adaptar la experiencia a mis necesidades.

### Requerimientos Funcionales

- Editar nombre, email y contraseña.
- Cambiar idioma y unidades (km/L, mpg, L/100km).
- Cerrar sesión.
- Eliminar cuenta (confirmación obligatoria).

### Criterios de Aceptación

- La sesión se invalida al cambiar contraseña o eliminar cuenta.
- Las preferencias se guardan por usuario y persisten al iniciar sesión nuevamente.

---

## ✅ Conclusión

Este backlog define las **interacciones principales del usuario autenticado** dentro del sistema de gestión de vehículos.  
Cada módulo puede desarrollarse de manera independiente y conectarse a través del sistema de **Operations** central (`fuel`, `service`, `transaction`, `odometer`), garantizando extensibilidad y consistencia.
