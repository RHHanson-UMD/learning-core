# Security policy

## Reporting vulnerabilities

Do not publish credentials, private class materials, unreleased homework, or exploit details in Issues, pull requests, Actions logs, or commits. Use GitHub's private vulnerability reporting at https://github.com/RHHanson-UMD/learning-core/security/advisories/new when enabled. Otherwise contact the maintainer privately through an established secure channel. Do not post sensitive reproduction details publicly.

## Scope

This public educational project accepts reports of client-side injection, GitHub Actions or dependency supply-chain vulnerabilities, inadvertently published secrets, and restricted teaching materials.

## Remediation

Immediately revoke and replace any exposed credentials. Removing a secret from the current revision does not undo exposure from Git history. Keep remediation commits free of sensitive values; test changes before merging or publishing.
