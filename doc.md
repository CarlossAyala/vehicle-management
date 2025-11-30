# 🚗 Vehicle Management System

## 📘 Descripción General

Aplicación para la **gestión de vehículos** que atiende a dos tipos de usuarios:

- **Uso Personal:** Control individual de gastos, combustible, mantenimientos y rendimiento.
- **Uso de Flota (Fleet):** Administración de múltiples vehículos y conductores con reportes de eficiencia y costos.

El sistema permite registrar y analizar todas las **operaciones realizadas sobre un vehículo**, tales como carga de combustible, mantenimientos, gastos, ingresos y lecturas de odómetro.

Inspirado en las funcionalidades de **Drivvo**, el objetivo principal es ofrecer una vista completa del **rendimiento y costos asociados a cada vehículo o flota**.

---

## 🧩 Arquitectura y Tecnologías

- **Backend:** NestJS  
- **ORM:** TypeORM  
- **Base de Datos:** PostgreSQL  
- **Lenguaje:** TypeScript  
- **Validaciones:** class-validator / class-transformer  
- **Frontend:** React (Vite + React Query) *(en desarrollo)*

---

## 🧱 Entidades Principales

### **User**

- `id`, `name`, `email`, `password`, etc.

### **Tenant**

- `id`, `name`, `type` → `personal | fleet`
- Relación 1:N con vehículos y usuarios.

### **UserTenant**

- `id`, `tenant_id`, `user_id`, `role` → `owner | admin | fleet_manager | driver`

### **Vehicle**

- `id`, `brand`, `model`, `variant`, `year`, `tenant_id`, etc.

### **Category**

- `id`, `name`, `source` (relacionada con `operation.type`)
- Puede ser global o específica por `tenant`.

### **Operation**

- `id`
- `type` → `fuel | odometer | service | transaction`
- `tenant_id`, `vehicle_id`, `author_id`
- Registra toda acción relevante sobre un vehículo.

---

## ⚙️ Tipos de Operation y sus Entidades Asociadas

| Operation Type | Entidad Asociada | Descripción |
|----------------|------------------|--------------|
| **FUEL** | `fuel` | Carga de combustible, con cantidad, monto y odómetro opcional. |
| **ODOMETER** | `odometer` | Registro del kilometraje actual del vehículo (manual o vinculado a otra operación). |
| **SERVICE** | `service`, `service_item` | Mantenimientos preventivos o correctivos. Puede incluir múltiples ítems con sus costos y categorías. |
| **TRANSACTION** | `transaction`, `transaction_item` | Representa gastos e ingresos financieros (taxes, seguros, multas, ingresos por transporte, etc.). |

---

## 💵 Transaction Model

### **Transaction**

- `id`
- `type` → `expense | income`
- `operation_id`
- `total_amount`
- `description?`
- `items: TransactionItem[]`

### **TransactionItem**

- `id`
- `amount`
- `description?`
- `category_id?`
- `transaction_id`

> Cada `Transaction` tiene un solo `type`.  
> Los `items` son el desglose detallado (por ejemplo, diferentes compras dentro del mismo gasto).

### **Ejemplo de Registro**

```json
{
  "type": "expense",
  "operationId": "ab12cd34-5678-90ef-1234-567890abcdef",
  "totalAmount": 15000,
  "description": "Compra de artículos para el auto",
  "items": [
    {
      "amount": 10000,
      "description": "Perfume para auto",
      "categoryId": "categ-123"
    },
    {
      "amount": 5000,
      "description": "Trapo de microfibra",
      "categoryId": "categ-456"
    }
  ]
}
```

---

## Categorías por Tipo de Operación

### FUEL

- Gasoline
- Diesel
- Ethanol
- LPG / GNC
- Electric charge
- Other

### SERVICE

- Oil change
- Filter replacement
- Tire change / rotation
- Brake check / replacement
- Battery
- Suspension
- Transmission
- Cooling system
- Lights / electrical
- General inspection
- Other

### TRANSACTION

#### Expenses

- Taxes / Fees
- Insurance
- Financing / Leasing
- Fines / Tickets
- Parking
- Toll
- Accessories
- Cleaning / Carwash
- Maintenance
- Other

#### Income

- Ride-hailing / Taxi
- Delivery
- Freight / Cargo
- Leasing / Sub-rent
- Reimbursement
- Sale of parts / accessories
- Other

---

## Modulos Planeados

| Módulo                    | Descripción                                 |
| ------------------------- | ------------------------------------------- |
| **Refueling**             | Control y análisis de combustible.          |
| **Service**               | Registro de mantenimientos y servicios.     |
| **Transactions**          | Gastos e ingresos financieros del vehículo. |
| **Odometer**              | Historial de kilometraje.                   |
| **Reminders** *(próximo)* | Recordatorios por fecha o kilometraje.      |
| **Checklist** *(próximo)* | Control preventivo del estado del vehículo. |
| **Reports** *(próximo)*   | Estadísticas y reportes agregados.          |

---

## 📊 Reportes y Métricas Clave (como Drivvo)

| Métrica                        | Fuente               | Descripción                        |
| ------------------------------ | -------------------- | ---------------------------------- |
| **Average consumption (Km/L)** | fuel + odometer      | Km recorridos / litros cargados    |
| **Cost per km**                | fuel + transaction   | Gasto total / km recorridos        |
| **Expenses by category**       | transaction_item     | SUM(amount) agrupado por categoría |
| **Maintenance cost**           | service_item         | Gasto total en mantenimientos      |
| **Average fuel price**         | fuel                 | Promedio del costo por litro       |
| **Total cost per vehicle**     | transaction          | SUM(totalAmount) por vehículo      |
| **Fleet cost summary**         | transaction (tenant) | SUM(totalAmount) por tenant/fleet  |

---

## Objetivo Final

Tener un sistema robusto y extensible que permita:

- A los usuarios personales: controlar gastos, consumo y mantenimiento de su vehículo.
- A las flotas: monitorear costos, eficiencia y mantenimiento de múltiples vehículos.
