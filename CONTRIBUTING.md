# How to Contribute to TinyConfig

We welcome contributions! Here's how:

## Reporting Bugs

- Go to the Issues tab on GitHub
- Click "New issue"
- Write a clear title like "Bug: [description]"
- Describe:
  - What happened
  - Steps to reproduce the bug
  - Expected behavior
  - Actual behavior

## Suggesting Features

- Create a new Issue
- Title: "Feature: [feature name]"
- Explain:
  - What the feature should do
  - Why it would be useful
  - How it should work

## Local Setup

- Install dependencies: `npm install`
- Run the demo: `npm start`
- Run tests: `npm test`

## Submitting Code Changes

- Fork the repository
- Create a branch: `git checkout -b feature/your-feature-name`
- Make your changes
- **Verify functionality:**
  - Run the demo: `npm start`
  - Run unit tests: `npm test`
- Commit: `git commit -m "feat: add your feature"`
- Push: `git push origin feature/your-feature-name`
- Create a Pull Request on GitHub

## What to Validate

When changing loaders or merge logic, please confirm:
- **Priority merging** still works as intended (e.g., .env > yaml > json)
- **Deep merging** works correctly (nested objects merge without overwriting sibling keys)
- **Missing files** are handled gracefully (warnings, no crash)

## Code Style

- Use 2 spaces for indentation (not tabs)
- Add comments for complex code
- Write meaningful commit messages
