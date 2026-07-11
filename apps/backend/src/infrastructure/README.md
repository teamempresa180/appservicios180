# Infrastructure (app-wide)

Piezas de infraestructura que ninguna capa de dominio/aplicación
conoce, compartidas por todos los módulos — no confundir con la
carpeta `infrastructure/` **dentro** de cada módulo (`identity/`,
`authentication/`, `credentials/`, ...), que contiene los adaptadores
*específicos* de ese módulo (repositorios Prisma, mappers).

```
infrastructure/
  prisma/
    prisma.service.ts   — único PrismaClient de toda la app, ciclo de vida vía OnModuleInit/OnModuleDestroy
    prisma.module.ts    — @Global(), expone PrismaService
```

Ver `prisma/schema.prisma` (raíz de `apps/backend/`) para el modelo de
datos y `PROJECT_STATUS.md`/`SPRINT3_PREPARATION.md` para la decisión
de usar Prisma + PostgreSQL como estrategia oficial de persistencia
(Sprint 3, Etapa 2).
