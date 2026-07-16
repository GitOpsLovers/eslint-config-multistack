# Instructions for Agents
​
This document describes the standard practices and requirements for the development, testing, and maintenance of the ESLint library `@gitopslovers/eslint-config-multistack`.
​
## Technical stack & configuration
​
**NodeJS:** 24.15.0
**PNPM:** 11.1.2
**asdf:** the development environment is made available through the `asdf` version management tool. These versions are defined in the `.tool-versions` file.
​
## 2. Coding standards & conventions

The code is organized into different presets for each of the stacks or technologies supported by the library. In turn, each preset uses specific, reusable configurations designed for a single purpose.

You should always follow these practices:
​
**Modularity:** the code should be organized into small, reusable functions or logical modules.
**Readability:** use clear, descriptive names for variables and functions.
​
## 3. Testing & quality assurance
​
**Unit Tests:** every new feature or fix must be accompanied by comprehensive unit tests that cover core functionality and edge cases.
**Test framework:** the project uses `Vitest` to run unit tests.
**Command:** `pnpm run test`.
​
## 4. Deployment & verification
​
**Continuous Integration (CI):** all code changes must be submitted via a Pull Request and pass the checks defined in the `pr-verify.yml` workflow.

## 5. Git & GitHub Workflow

**Estrategia de ramas:** trunk-based development sobre `main`.
**Nunca commitear directamente a `main`.** Toda tarea de desarrollo debe iniciarse creando una rama nueva desde `main` actualizado.

**Naming de ramas:**
- `feat/<breve-descripcion>` para nuevas funcionalidades
- `fix/<breve-descripcion>` para correcciones
- `chore/<breve-descripcion>` para tareas de mantenimiento
- `docs/<breve-descripcion>` para documentación

**Mensajes de commit:** formato [Conventional Commits](https://www.conventionalcommits.org/):
`type(scope): descripción breve` (tipos: feat, fix, refactor, chore, docs, test).
Líneas de asunto ≤ 72 caracteres. Añadir cuerpo cuando el diff sea grande.

**Antes de commitear:** ejecutar `pnpm run test` y asegurarse de que pasa.

**Herramienta:** usar el `gh` CLI para operaciones con GitHub (branch, commit, push, PR).

**Flujo estándar para cada tarea de desarrollo:**
1. Crear y cambiar a una rama nueva desde `main` (`git checkout -b <tipo>/<descripcion>`).
2. Implementar el cambio con tests unitarios (Vitest) que cubran el caso.
3. Ejecutar `pnpm run test` y confirmar que pasa.
4. Commitear siguiendo Conventional Commits.
5. Hacer `git push -u origin <rama>`.
6. Abrir un Pull Request con `gh pr create`, incluyendo:
   - Resumen de los cambios ("## Summary")
   - Plan de pruebas ("## Test plan") con checklist
   - Referencia al issue si aplica (`Closes #N`)
7. **Nunca mergear automáticamente.** El PR queda pendiente de revisión humana y de que pase el workflow `pr-verify.yml`.

**Confirmación:** pedir confirmación explícita antes de hacer `git push` (acción de alto riesgo por afectar estado remoto).