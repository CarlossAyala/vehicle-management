# Tabla de asignaciones de vehículos (por ejemplo: vehicle_driver_assignment)

Qué información incluye un driver_assignment

- vehicleId → qué vehículo se asigna
- driverId → quién lo recibe
- tenantId → a qué flota pertenece la asignación
- startDate → cuándo comienza la asignación
- endDate → cuándo termina (nullable si sigue en curso)
- description o notes → opcional, para observaciones

# Drivers → tabla centralizada de conductores, vinculada a user. Contiene datos permanentes: licencia, teléfono, foto, dirección, etc

# Ver el estado actual del auto, ya que diferentes type de Operations pueden tomar más tiempo

Ejemplo de estados para operaciones:

- pending → aún no comenzó.
- in_progress → está en curso.
- completed → ya terminó.
- canceled → se anuló.
