#!/usr/bin/env python3
"""Fail closed on accidental public publication of private course files and unsafe workflows.

This is a defense-in-depth check, NOT a replacement for secret scanning or rights review.
Run against all tracked files, including new files, in each PR and before deployment.
"""
from __future__ import annotations

import argparse
from pathlib import Path
import re
import subprocess
import sys

PROHIBITED_EXTENSIONS = {
    ".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx",
    ".zip", ".7z", ".rar", ".sqlite", ".db", ".pem", ".p12",
    ".pfx", ".key", ".kdbx", ".asc", ".pgp",
}
PRIVATE_NAMES = re.compile(
    r"^(?:\.env(?:\..+)?|id_rsa(?:\.pub)?|id_ed25519(?:\.pub)?|"
    r"credentials(?:\..+)?|service[-_]account(?:\..+)?|"
    r"(?:.*(?:secret|token|password|credential|api[-_]?key).*)\.(?:txt|json|env))$",
    re.IGNORECASE,
)
# Reject links to private course storage even when the link itself is not a credential.
PRIVATE_LINKS = re.compile(
    r"https?://(?:drive\.google\.com/(?:file/d/|drive/folders/)|"
    r"docs\.google\.com/(?:document|presentation|spreadsheets)/d/|"
    r"elms\.umd\.edu/)",
    re.IGNORECASE,
)
USES = re.compile(r"^\s*-\s*uses:\s*(\S+)", re.MULTILINE)
PINNED = re.compile(r"^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)?@[0-9a-f]{40}$")
FORBIDDEN_TRIGGERS = re.compile(r"^\s*(?:pull_request_target|workflow_run)\s*:", re.MULTILINE)
WRITE_ALL = re.compile(r"^\s*permissions:\s*write-all\s*$", re.MULTILINE)


def check_path(path: str) -> list[str]:
    p = Path(path)
    problems: list[str] = []
    if p.suffix.lower() in PROHIBITED_EXTENSIONS:
        problems.append("restricted file format (requires out-of-band rights review)")
    if PRIVATE_NAMES.fullmatch(p.name):
        problems.append("credential/secret-looking filename")
    return problems


def check_text(path: str, content: str) -> list[str]:
    problems: list[str] = []
    if PRIVATE_LINKS.search(content):
        problems.append("private course-storage URL (use neutral references)")
    if path.startswith(".github/workflows/") and path.endswith((".yml", ".yaml")):
        if FORBIDDEN_TRIGGERS.search(content):
            problems.append("privileged workflow trigger requires separate security review")
        if WRITE_ALL.search(content):
            problems.append("workflow requests write-all token permissions")
        for action in USES.findall(content):
            if not action.startswith("./") and not PINNED.fullmatch(action):
                problems.append("action must be pinned to a full 40-character commit SHA")
    return problems


def tracked_files() -> list[str]:
    result = subprocess.run(
        ["git", "ls-files", "-z"], check=True, capture_output=True
    )
    return sorted(x.decode("utf-8") for x in result.stdout.split(b"\0") if x)


def audit(root: Path, paths: list[str]) -> list[str]:
    failures: list[str] = []
    for name in paths:
        if Path(name).is_absolute() or ".." in Path(name).parts:
            failures.append(f"{name}: unsafe path")
            continue
        for issue in check_path(name):
            failures.append(f"{name}: {issue}")
        target = root / name
        if not target.is_file():
            continue
        payload = target.read_bytes()
        if b"\0" in payload or len(payload) > 3_000_000:
            continue
        content = payload.decode("utf-8", errors="replace")
        for issue in check_text(name, content):
            failures.append(f"{name}: {issue}")
    return failures


def self_test() -> None:
    assert check_path("upload/lecture.pdf")
    assert check_path("Developer Token.txt")
    assert check_path("keys/.env.production")
    assert check_path("secrets/id_rsa")
    assert not check_path("site/visualizations/lesson.js")
    assert check_text("site/index.html", '<a href="https://" + "drive.google.com/file/d/opaque">')
    assert check_text(".github/workflows/test.yml", "on:\n  pull_request_target:\n")
    assert check_text(".github/workflows/test.yml", "permissions: write-all\n")
    assert check_text(".github/workflows/test.yml", "- uses: actions/checkout@v4\n")
    assert not check_text(
        ".github/workflows/test.yml",
        "- uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262\n",
    )
    assert not check_text("site/index.html", "https://example.edu/open-textbook")
    print("Publication guard self-tests passed")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return 0
    failures = audit(Path.cwd(), tracked_files())
    for failure in failures:
        print(f"ERROR: {failure}", file=sys.stderr)
    if failures:
        print(f"Publication guard blocked {len(failures)} issue(s).", file=sys.stderr)
        return 1
    print("Publication guard passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
