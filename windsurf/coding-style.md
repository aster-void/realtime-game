# General
- Prefer minimal code.
- Use blank lines to separate logical blocks of code. Use them sparingly.

# Comments & Documentation
- Use English for all code and documentation.
- Create necessary types.
- Use JSDoc to document public classes and methods.
- Don't leave blank lines within a function.
- Avoid unnecessary comments (comments should explain "why" or "how", not "what").

# Naming Conventions
- Use PascalCase for classes.
- Use camelCase for variables, functions, and methods.
- Use kebab-case for file and directory names.
- Use UPPERCASE for environment variables.
- Avoid magic numbers and define constants.

# Functions & Logic
- Keep functions short and single-purpose (<20 lines).
- Avoid deeply nested blocks by:
- Using early returns.
- Extracting logic into pure functions.
- Use higher-order functions (map, filter, reduce) to simplify logic.

# Data Handling
- Avoid excessive use of primitive types; encapsulate data in composite types.
- Use tagged union types for values that can take only one of several shapes.
- Prefer immutability for data.
- Don't overuse immutability: it can hurt memory usage and performance.