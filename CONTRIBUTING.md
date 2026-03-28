# Contributing to Aperio

Thank you for your interest in contributing to Aperio! We welcome all kinds of contributions — bug reports, feature requests, documentation improvements, and code changes.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Report a Bug](#how-to-report-a-bug)
- [How to Request a Feature](#how-to-request-a-feature)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Style](#coding-style)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## Code of Conduct

Please be respectful and constructive in all interactions. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).

---

## How to Report a Bug

1. Check that the bug hasn't already been reported in the [Issues](https://github.com/Surajphirke3/Aperio/issues) tab.
2. Open a new issue and include:
   - A clear, descriptive title
   - Steps to reproduce the behaviour
   - Expected vs. actual behaviour
   - Your environment (OS, Python version, Node version, browser, etc.)
   - Relevant logs or screenshots

---

## How to Request a Feature

Open a new issue with the `enhancement` label and describe:
- The problem you are trying to solve
- Your proposed solution
- Any alternatives you considered

---

## Development Setup

See the [Installation & Setup](README.md#installation--setup) section of the README for full setup instructions.

Quick summary:

```bash
# Backend
cd backend/aperio-api
cp .env.example .env   # fill in your API keys
docker compose up --build

# Frontend
cd frontend
npm install
npm run dev

# Mobile
cd android
npm install
npm start
```

### Running tests

```bash
# Backend
cd backend/aperio-api
poetry run pytest

# Frontend
cd frontend
npm run lint
```

---

## Pull Request Process

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and add or update relevant tests.
3. Ensure linting passes:
   - Backend: `poetry run ruff check src/`
   - Frontend: `npm run lint`
4. Commit using [conventional commits](#commit-message-guidelines).
5. Push your branch and open a Pull Request against `main`.
6. Fill in the PR template, link related issues, and wait for a review.

PRs are merged once they have at least one approving review and all CI checks pass.

---

## Coding Style

### Python (backend)
- Follow [PEP 8](https://peps.python.org/pep-0008/).
- Use [Ruff](https://docs.astral.sh/ruff/) for linting and formatting.
- Type-annotate all public functions and class attributes using Python 3.11+ syntax.
- Use Pydantic models for all API request/response schemas.

### TypeScript / JavaScript (frontend & mobile)
- Follow the existing ESLint configuration.
- Use TypeScript strict mode — avoid `any`.
- Prefer functional React components and hooks.
- Use Zod for runtime schema validation.

---

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>
```

Common types:

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code restructure without behaviour change |
| `test` | Adding or updating tests |
| `chore` | Build scripts, CI, dependency updates |

Examples:
```
feat(chat): add voice-to-text batch logging
fix(api): handle missing vendor gracefully in batch endpoint
docs(readme): add screenshots section
```

---

Thank you for helping make Aperio better! 🌱
