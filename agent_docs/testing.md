# Testing Conventions

## Philosophy
Write tests that verify behavior, not implementation details.

## What to Test
- User interactions (clicks, inputs, form submissions)
- Data transformations and calculations
- Error states and edge cases
- Component rendering with different props

## What NOT to Test
- Implementation details (internal state, private methods)
- Third-party library internals
- Trivial code (getters, setters)

## Naming
Test names should complete the sentence: "It should..."
- ✓ "renders point cloud when LAS file is loaded"
- ✗ "test render function"

## Key Principles
1. Tests should be independent (no shared state)
2. One assertion concept per test
3. Keep tests simple and readable
4. Mock external dependencies (APIs, file system)

## Visual Testing
- Make sure the app visually renders by using Playwright + Chrome DevTools MCP
- When using Playwright, check the console to make sure there are no errors there.
- If there is an existing server or chrome instance, use that one
- Make sure the app is visually consistent and abides by the front-end design skill
- Make sure to kill (not just close the shell) the node server after testing. Do this by checking what server is the port you opened and then closing it
