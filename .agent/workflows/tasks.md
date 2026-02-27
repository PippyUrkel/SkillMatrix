---
description: Show project-specific tasks from task.md
---

# /tasks Workflow

<objective>
Display the current project tasks from the root task.md file.
</objective>

<process>

## 1. Load task.md

```powershell
if (-not (Test-Path "task.md")) {
    Write-Output "No task.md found in the root directory."
    exit
}

Get-Content "task.md"
```

---

## 2. Display Status

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 GSD ► PROJECT TASKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{Contents of task.md}

───────────────────────────────────────────────────────
```

</process>
