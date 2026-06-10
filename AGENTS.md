# Instructions for Agents
​
This document describes the standard practices and requirements for the development, testing, and maintenance of the ESLint library `@gitopslovers/eslint-config-multistack`.
​
## Technical stack & configuration
​
**NodeJS:** 24.15.0
**PNPM:** 11.1.2
**asdf:** The development environment is made available through the `asdf` version management tool. These versions are defined in the `.tool-versions` file.
​
## 2. Coding standards & conventions
​
**Modularity:** The code should be organized into small, reusable functions or logical modules. The configurations provided by the library are declared in `presets`, and the `presets` use specific configurations that encapsulate the particular logic.
**Readability:** Use clear, descriptive names for variables and functions.
​
## 3. Testing & quality assurance
​
**Unit Tests:** Every new feature or fix must be accompanied by comprehensive unit tests that cover core functionality and edge cases.
**Test Framework:** The project uses `Vitest` to run unit tests.
**Command:** `pnpm run test`.
​
## 4. Deployment & verification
​
**Continuous Integration (CI):** All code changes must be submitted via a Pull Request and pass the checks defined in the `pr-verify.yml` workflow.