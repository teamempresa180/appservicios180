# Audit — Application Layer

Estructura preparatoria de la capa Application para el módulo `Audit`.
Ninguna clase aquí implementa lógica de negocio ni persistencia real — son
esqueletos con las dependencias correctamente tipadas.

## Commands

- `CreateAuditRecordCommand` (no existe update/delete: los registros de
  auditoría son inmutables por diseño)

## Queries

- `GetAuditQuery`
- `SearchAuditQuery`
- `ListAuditQuery`

## Use Cases

Con `AuditRepository` inyectado por constructor, con lógica real de persistencia:

- `CreateAuditRecordUseCase`
- `GetAuditUseCase`

## DTO

- `CreateAuditRecordDto`
- `AuditRecordDto` (salida)

## Mapper

`AuditMapper` traduce `Audit` (dominio) → `AuditRecordDto`. Solo copia de
campos, sin lógica adicional.

## Qué NO contiene

Lógica de negocio, validaciones, APIs, controladores, servicios de NestJS,
persistencia ni infraestructura.
