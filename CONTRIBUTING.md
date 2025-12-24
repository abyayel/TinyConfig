# 🤝 How to Contribute to TinyConfig

We welcome contributions! Here's how you can help make TinyConfig better.

---

## 🐛 Reporting Bugs

1. Go to the **Issues** tab on GitHub.
2. Click **"New issue"**.
3. Write a clear title like `Bug: [description]`.
4. Describe:
   - **What happened**
   - **Steps to reproduce the bug**
   - **Expected behavior**
   - **Actual behavior**

---

## 💡 Suggesting Features

1. Create a new **Issue**.
2. Title: `Feature: [feature name]`.
3. Explain:
   - **What** the feature should do.
   - **Why** it would be useful.
   - **How** it should work.

---

## 💻 Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the demo:**
   ```bash
   npm start
   ```
3. **Run tests:**
   ```bash
   npm test
   ```

---

## 🚀 Submitting Code Changes

1. **Fork** the repository.
2. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes.**
4. **Verify functionality:**
   - Run the demo: `npm start`
   - Run unit tests: `npm test`
5. **Commit:**
   ```bash
   git commit -m "feat: add your feature"
   ```
6. **Push:**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request** on GitHub.

---

## ✅ What to Validate

When changing loaders or merge logic, please confirm:

- [ ] **Priority merging** still works as intended (e.g., `.env` > `yaml` > `json`).
- [ ] **Deep merging** works correctly (nested objects merge without overwriting sibling keys).
- [ ] **Missing files** are handled gracefully (warnings, no crash).

---

## 🎨 Code Style

- Use **2 spaces** for indentation (not tabs).
- Add **comments** for complex code.
- Write **meaningful commit messages**.
