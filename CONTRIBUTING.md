# Contributing to EO TranslatorJS

Thank you for your interest in contributing to **EO TranslatorJS**! We appreciate your help in making the project better.

Before you start contributing, please take a moment to review this guide, which outlines the process for contributing and the community guidelines we follow.

## Code of Conduct

We have a [Code of Conduct](CODE_OF_CONDUCT.md) that we expect all contributors to adhere to. Please read it and make sure you understand and follow it in all your interactions within our project.

## Getting Started

- If you are new to our project, please review our [README](README.md) for an overview of the project and how to get started.

- Check our [Issues](https://github.com/eoussama/eo-translatorjs/issues) to find tasks that need assistance or to report any bugs or feature requests.

You need Node.js 24 or later and pnpm 12.15.0. npm is refused by the project's `devEngines`.

## How to Contribute

1. Fork the repository to your GitHub account.

2. Clone your fork and install dependencies:

   ```bash
   git clone https://github.com/<your-username>/eo-translatorjs.git
   cd eo-translatorjs
   pnpm install
   ```

3. Install the browser used by the end-to-end tests:

   ```bash
   pnpm exec playwright install chromium
   ```

4. Create a new branch for your contribution:

   ```bash
   git checkout -b feat/your-feature-name
   ```

5. Make sure every check passes before submitting: `pnpm check` runs the audit, type check, lint, unit tests (100% coverage), build, smoke tests, docs build, end-to-end tests and mutation tests (95% or more).

## Coding Standards

- Use TypeScript throughout the codebase
- Follow the existing project code style and linting rules: `pnpm lint`
- Write unit tests for new features and keep coverage at 100%
- Add a docs example or demo when a feature is user-facing
