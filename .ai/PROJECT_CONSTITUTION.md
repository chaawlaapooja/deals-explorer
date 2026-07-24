# Mini Deals Explorer - Project Constitution

## Objective

Build a production-quality React Native application that demonstrates clean architecture, maintainable code, and sound engineering decisions.

The goal is not to maximize features.

The goal is to maximize code quality, readability, and extensibility.

---

## Core Principles

- Simplicity over cleverness.
- Readability over brevity.
- Composition over inheritance.
- Small focused components.
- Feature-first architecture.
- Strong typing.
- Predictable state management.

---

## Tech Stack

- Expo
- Expo Router
- TypeScript (strict)
- React Query
- React Hook Form
- Context API

---

## Folder Structure

app/

src/
  components/
  constants/
  features/
  hooks/
  lib/
  providers/
  services/
  theme/
  types/
  utils/

Every feature owns its own:

- components
- hooks
- types
- api

---

## State Management

Server State

→ React Query

Application State

→ Context

Local State

→ useState

Do not duplicate state.

---

## API Design

Screens never access JSON directly.

Always call

Hook

↓

API

↓

Mock Data

This allows swapping the mock layer with the real API later.

---

## TypeScript

Strict mode.

Never use any.

Prefer explicit interfaces.

Prefer readonly where appropriate.

Avoid unnecessary generics.

---

## Components

Keep components focused.

Extract reusable UI only after duplication appears.

Do not build "generic" components prematurely.

---

## Styling

Centralize:

- colors
- spacing
- typography
- radius

Never hardcode repeated values.

---

## React

Prefer functional components.

Prefer hooks.

Memoize only when justified.

Avoid prop drilling where practical.

---

## React Query

Every async operation should expose:

loading

error

success

Avoid manual loading flags.

---

## Naming

Components → PascalCase

Hooks → useSomething

Files → kebab-case where appropriate

Types → PascalCase

Constants → UPPER_SNAKE_CASE only for true constants

---

## Accessibility

Touchable areas should be large enough.

Inputs should have labels.

Buttons should expose accessibility labels.

---

## Performance

Use FlatList.

Avoid unnecessary re-renders.

Keep render functions simple.

---

## Error Handling

Every async screen should support:

Loading

Error

Empty

Success

---

## Out of Scope

No backend.

No authentication service.

No payments.

No admin functionality.

No over-engineering.

Implement only what the assignment requires.

---

## Definition of Done

Every feature must:

Compile successfully.

Be fully typed.

Be readable.

Be testable.

Avoid dead code.

Avoid TODO comments.

Respect project architecture.

If a requirement is unclear,

prefer the simplest maintainable solution.