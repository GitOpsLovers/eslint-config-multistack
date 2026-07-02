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