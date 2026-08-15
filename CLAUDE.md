## Workflow

- Do new work in a new git worktree (not directly on `main`) — create a branch and `git worktree add .worktrees/<branch> -b <branch>` before editing.

## Agent skills

### Issue tracker

Issues and specs live as GitHub issues on `philjhale/pension-calculator`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Pull requests

Always fill out `.github/PULL_REQUEST_TEMPLATE.md` in full (Summary, Details, Test plan) when opening a PR with `gh pr create --body`. Leave every Test plan checkbox unticked — describe what to verify, don't run it yourself.

Before opening a PR, run the `code-reviewer` subagent (`.claude/agents/code-reviewer.md`) against the diff and address its findings, or note in the PR why a finding wasn't addressed.

### UI verification

Any change to the UI must be verified by actually running it and posting the result in the chat, not just by passing type checks/tests — confirm the change renders and behaves correctly before reporting the task as complete.

- Simple visual changes (styling, layout, copy) — post a screenshot.
- Interactive features (anything the user clicks, drags, types into, or otherwise operates) — post a short video showing the interaction actually working end to end. When capturing that video, make sure the relevant element is scrolled into view and stays in frame for the whole interaction, not just present somewhere in the page. Videos must be encoded so they play natively on an iPhone (H.264/AAC in an `.mp4` container, `yuv420p` pixel format) — convert with `ffmpeg` if the capture tool outputs something else (e.g. `.webm`).
