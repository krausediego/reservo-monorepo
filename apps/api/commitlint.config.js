module.exports = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ["RV-"],
    },
  },
  ignores: [
    (commitMsg) => {
      const prefixesToIgnore = ["[TEST]", "[CI-CD]", "[NOID]"];
      return prefixesToIgnore.some((prefix) => commitMsg.includes(prefix));
    },
  ],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "test",
      ],
    ],
    "references-empty": [2, "never"],
    "type-case": [2, "always", "lower-case"],
    "subject-case": [2, "always", ["sentence-case"]],
    "subject-max-length": [2, "always", 50],
    "subject-full-stop": [2, "never", "."],
    "subject-empty": [2, "never"],
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [2, "always", 72],
    "footer-leading-blank": [2, "always"],
    "footer-max-line-length": [2, "always", 72],
  },
};
