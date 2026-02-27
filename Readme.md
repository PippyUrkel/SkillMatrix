# SkillMatrix Backend

This repository contains the backend API for **SkillMatrix**, a skill gap analysis platform. The service is built with **FastAPI** and exposes endpoints for authentication, curricula, profile management, skill analysis, evaluation and a federated‑learning module.

## Key Features

- Modular FastAPI app under `backend/app/features/*`.
- Built-in **Federated Learning (FL)** service (`app.features.fl`) supporting asynchronous weight updates and FedAvg aggregation.
- Pluggable authentication via Appwrite (signup/login endpoints).
- Other domain APIs for curriculum, profile, skill analysis/evaluation (stubbed for now).

> The FL implementation is self-contained and does not require external infrastructure. It uses in-memory state and will auto-aggregate updates on each request. A sample client simulation exists in `references/Asynchronus FL` if you need a standalone demo.

## Getting Started

1. **Create a Python environment** (e.g. `python -m venv .venv` in `backend/`).
2. **Activate it** (`.\\backend\\.venv\\Scripts\\activate` on Windows).
3. **Install dependencies**:

    ```powershell
    cd backend
    pip install -e .
    ```

4. **Run the API server**:

    ```powershell
    uvicorn backend.main:app --reload
    ```

5. **Explore the docs**: visit `http://localhost:8000/docs` for interactive OpenAPI.

## API Endpoints

| Method | Path                  | Description |
|--------|-----------------------|-------------|
| GET    | `/`                   | Health check, returns running message |
| GET    | `/api/fl/model`       | Retrieve current global model weights/version |
| POST   | `/api/fl/updates`     | Submit weight delta; FedAvg aggregation occurs automatically |
| POST   | `/api/auth/signup`    | Register new user (Appwrite) |
| POST   | `/api/auth/login`     | Login existing user |
| GET    | `/api/auth/me`        | Get current user (requires auth) |

*(Other feature endpoints live under respective routers.)*

## Testing

Run the tests with:

```powershell
cd backend
pytest -q
```

Current coverage includes basic health checks and the FL endpoints. `backend/test_github.py` can exercise the skill-analysis logic separately.

## Cleanup & Git Ignore

The workspace includes a reference FL prototype (`references/Asynchronus FL`). It is kept for archival purposes but is ignored via `.gitignore` and not part of the primary project. Large build artifacts such as `global_model.pth`, `__pycache__/`, and front-end build outputs are likewise ignored. Remove any unnecessary files manually when doing a deep clean.

## Notes

- Add new Python dependencies in `backend/pyproject.toml` under `[project].dependencies` and re-install.
- The FL service uses a basic FedAvg implementation; for production plug in Redis or Appwrite storage.
- To integrate the fuller asynchronous simulation from the reference project, copy over its modules and update the project dependencies accordingly.
