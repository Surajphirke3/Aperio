# Contributing to Aperio

Thank you for your interest in contributing to Aperio! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Reporting Issues](#reporting-issues)

---

## Getting Started

### 1. Fork the Repository

Click the **Fork** button at the top right of the [Aperio repository](https://github.com/Surajphirke3/DIMENSITY_LABS_hn4).

### 2. Clone Your Fork

```bash
git clone https://github.com/<your-username>/DIMENSITY_LABS_hn4.git
cd DIMENSITY_LABS_hn4
```

### 3. Add the Upstream Remote

```bash
git remote add upstream https://github.com/Surajphirke3/DIMENSITY_LABS_hn4.git
```

### 4. Install Dependencies

Follow the setup instructions in the [README.md](README.md#-getting-started) for each part of the project (backend, frontend, mobile).

### 5. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

---

## Development Workflow

1. **Sync** your fork with upstream before starting work:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```
2. **Create** a feature branch from `main`.
3. **Make** your changes with clear, focused commits.
4. **Test** your changes locally.
5. **Push** your branch and open a pull request.

---

## Branch Naming Conventions

Use the following prefixes for your branches:

| Prefix | Use Case | Example |
|---|---|---|
| `feature/` | New feature | `feature/batch-export-csv` |
| `fix/` | Bug fix | `fix/chat-session-timeout` |
| `docs/` | Documentation changes | `docs/update-api-reference` |
| `refactor/` | Code refactoring | `refactor/chat-memory-module` |
| `test/` | Adding or updating tests | `test/chat-endpoint-integration` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |
| `hotfix/` | Critical production fix | `hotfix/cors-origin-crash` |

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Code style changes (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `chore` | Changes to build process or auxiliary tools |
| `ci` | Changes to CI configuration |

### Examples

```bash
feat(chat): add voice input support with Whisper transcription
fix(api): handle timeout in Featherless AI adapter
docs(readme): add mobile app setup instructions
refactor(memory): implement dual Redis+MongoDB storage
test(chat): add integration tests for session management
chore(deps): update FastAPI to 0.115.0
```

### Rules

- Use the **imperative mood** in the subject line: "add feature" not "added feature"
- Do **not** capitalize the first letter of the subject
- Do **not** end the subject line with a period
- Limit the subject line to **72 characters**
- Use the body to explain **what** and **why**, not how

---

## Pull Request Process

1. **Update** your branch with the latest `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push** your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** on GitHub against the `main` branch.

4. **Fill out** the PR template completely, including:
   - Description of changes
   - Related issue number(s)
   - Testing performed
   - Screenshots (if UI changes)

5. **Request a review** from at least one maintainer.

6. **Address** any review feedback promptly.

7. Once approved, a maintainer will **merge** your PR.

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code performed
- [ ] Changes are tested locally
- [ ] Documentation updated (if applicable)
- [ ] No new warnings or errors introduced
- [ ] Commit messages follow conventional commits

---

## Code Style

### Python (Backend)

- Follow [PEP 8](https://peps.python.org/pep-0008/) style guide
- Use type hints for function parameters and return values
- Use `async`/`await` for all I/O operations
- Use `logging` module instead of `print()` statements
- Docstrings for public functions and classes

### TypeScript/JavaScript (Frontend & Mobile)

- Use **TypeScript** for all new files
- Use **functional components** with hooks
- Follow the existing project structure and naming conventions
- Use `const` over `let`; avoid `var`
- Prefer named exports over default exports (except page components)

### General

- No hardcoded secrets or API keys — use environment variables
- Keep functions small and focused (single responsibility)
- Write meaningful variable and function names
- Remove unused imports and dead code

### Linting

```bash
# Frontend
cd frontend && npm run lint

# Backend (if configured)
cd backend/aperio-api && python -m flake8 src/
```

---

## Reporting Issues

### Before Reporting

1. **Search** existing issues to avoid duplicates
2. **Check** the [README](README.md) and documentation for answers
3. **Try** reproducing the issue with the latest `main` branch

### How to Report

Use our [issue templates](.github/ISSUE_TEMPLATE/) to file:

- **Bug Report** — something is broken or behaving unexpectedly
- **Feature Request** — suggest a new feature or improvement

### What to Include

- **Clear title** describing the issue
- **Steps to reproduce** (for bugs)
- **Expected vs. actual behavior**
- **Environment details** (OS, Node.js version, Python version, browser)
- **Screenshots or logs** if applicable
- **Minimal reproduction** if possible

---

## Questions?

If you have questions about contributing, feel free to open a [Discussion](https://github.com/Surajphirke3/DIMENSITY_LABS_hn4/discussions) or reach out to the maintainers.

Thank you for helping make Aperio better!
