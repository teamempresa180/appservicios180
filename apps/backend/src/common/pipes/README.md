# Pipes (reservado)

Carpeta reservada para pipes de validación/transformación globales
(Fase 7, Prompt 58 — Sprint 3 Etapa 1).

**Vacía a propósito.** Un `ValidationPipe` genérico necesitaría
`class-validator`/`class-transformer` (no instalados — agregar
dependencias nuevas está fuera de alcance de esta etapa) y, sobre
todo, **no tiene ningún consumidor real todavía**: ningún controller
implementa un endpoint real, así que no hay ningún DTO con decoradores
de validación que un pipe necesite procesar (ver
`modules/*/presentation/controllers/`, todos son esqueletos).

Se crea cuando el primer módulo real (siguiendo el roadmap de
`SPRINT3_PREPARATION.md`) implemente un endpoint que reciba datos de
entrada — no antes.
