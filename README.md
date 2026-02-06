# Task CLI

A production-grade command-line task management tool built with **TypeScript**, **SOLID principles**, and **12 design patterns**.

## Features

✨ **Command-Line Task Manager** — Quickly manage your tasks from the terminal  
🏗️ **SOLID Architecture** — Built with strict adherence to all 5 SOLID principles  
📘 **TypeScript** — 100% type-safe with strict mode enabled  
🎯 **Design Patterns** — Implements 12 industry-standard patterns  
⚡ **Zero Dependencies** — No runtime dependencies, dev-only tooling  
💾 **Persistent Storage** — Tasks stored in JSON with in-memory caching (O(1) lookups)

## Installation

Install globally to use `task-cli` anywhere:

```bash
npm install -g task-cli
```

Or clone and link locally:

```bash
git clone https://github.com/1omercohen/task-cli.git
cd task-cli
npm install
npm run build
npm link
```

## Usage

### Add a Task

```bash
task-cli add --description "Build new feature"
```

Creates a new task with **TODO** status.

### List Tasks

```bash
task-cli list
```

Lists all tasks with their IDs, statuses, and descriptions.

**Filter by Status:**
```bash
task-cli list --status TODO
task-cli list --status IN_PROGRESS
task-cli list --status DONE
```

### Mark Task as In Progress

```bash
task-cli mark-in-progress --id <task-id>
```

### Mark Task as Done

```bash
task-cli mark-done --id <task-id>
```

### Update a Task

```bash
task-cli update --id <task-id> --description "Updated description"
```

### Delete a Task

```bash
task-cli delete --id <task-id>
```

## Architecture

### MVC + Middleware Pipeline

```
┌─────────────────────────────────────────────┐
│              CLI Arguments                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │   Command Registry   │
        │  (Command Lookup)    │
        └──────────────┬───────┘
                       │
                       ▼
      ┌────────────────────────────────┐
      │     Middleware Pipeline        │
      ├────────────────────────────────┤
      │ 1. Validation Middleware       │
      │ 2. Handler Middleware          │
      │ 3. Print/View Middleware       │
      └────────────────────────────────┘
              │      │      │
              ▼      ▼      ▼
         ┌─────────────────────┐
         │    TaskDB (Model)   │
         │  (Repository Layer) │
         └──────────┬──────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  TaskView (View)     │
         │  (Output Formatting) │
         └──────────────────────┘
```

### Design Patterns (12 Total)

1. **MVC** — Model-View-Controller separation
2. **Middleware Pipeline** — Chain of Responsibility
3. **Registry Pattern** — Command registration and lookup
4. **Factory Pattern** — Middleware creation
5. **Command Pattern** — Task commands as objects
6. **Strategy Pattern** — Different validation strategies
7. **Repository Pattern** — Data access abstraction
8. **Singleton Pattern** — TaskDB instance
9. **Dependency Injection** — Loose coupling
10. **Adapter Pattern** — CLI input adaptation
11. **Builder Pattern** — Task construction
12. **Facade Pattern** — Simple CLI interface

### SOLID Principles

✅ **Single Responsibility** — Each class has one reason to change  
✅ **Open/Closed** — Open for extension, closed for modification  
✅ **Liskov Substitution** — Interfaces correctly implement contracts  
✅ **Interface Segregation** — Small, focused interfaces  
✅ **Dependency Inversion** — Depend on abstractions, not concretions

### Type Safety

- 100% TypeScript with strict mode
- Zero `any` types
- Full immutability (`readonly` properties, `Object.freeze()`)
- Comprehensive type definitions
- Custom error hierarchy

## Project Structure

```
├── src/
│   ├── abstractions/          # Interface contracts
│   │   ├── ITaskRepository.ts
│   │   ├── ITaskCommandController.ts
│   │   ├── ICommandRegistry.ts
│   │   └── IPipeline.ts
│   ├── controllers/
│   │   ├── CommandController.ts
│   │   └── CommandRegistry.ts
│   ├── models/
│   │   └── TaskDB.ts
│   ├── views/
│   │   └── TaskView.ts
│   ├── config.ts              # Configuration constants
│   ├── errors.ts              # Custom error classes
│   ├── main.ts                # Entry point
│   ├── middlewares.ts         # Middleware factories
│   ├── pipeline.ts            # Pipeline implementation
│   ├── types.ts               # Type definitions
│   ├── utils.ts               # CLI utilities
│   └── validation.ts          # Parameter validation
├── dist/                      # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

### Development with ts-node

```bash
npm run dev -- add --description "Test task"
```

### Build & Run

```bash
npm run dev:build
```

## Task Storage

Tasks are stored in a `tasks.json` file in your home directory:

```bash
~/.task-cli/tasks.json
```

Each task has:
- **id** — Unique identifier (base-36 timestamp)
- **description** — Task description
- **status** — TODO, IN_PROGRESS, or DONE
- **createdAt** — Creation timestamp
- **updatedAt** — Last update timestamp

## Example Workflow

```bash
# Add a new task
task-cli add --description "Refactor authentication module"

# View all tasks
task-cli list

# Mark as in progress
task-cli mark-in-progress --id <task-id>

# Mark as done
task-cli mark-done --id <task-id>

# View only completed tasks
task-cli list --status DONE
```

## Technology Stack

- **Runtime:** Node.js 14+
- **Language:** TypeScript 5.0+
- **Target:** ES2020
- **Dev Tools:** ts-node, ESC compiler
- **Dependencies:** Zero runtime dependencies

## Code Quality

- ✅ SOLID principles strictly enforced
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple, Stupid)
- ✅ YAGNI (You Aren't Gonna Need It)
- ✅ 100% type safety
- ✅ Zero technical debt

## License

MIT

## Author

Created as a production-grade example of enterprise-quality CLI tooling with TypeScript and design patterns.

---

**GitHub:** [https://github.com/1omercohen/task-cli](https://github.com/1omercohen/task-cli)
