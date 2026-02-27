from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)

def test_root():
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json() == {"message": "SkillMatrix API is running"}


def test_fl_model_default():
    resp = client.get("/api/fl/model")
    assert resp.status_code == 200
    data = resp.json()
    assert "weights" in data and "version" in data
    assert isinstance(data["version"], int)


def test_fl_update_success():
    delta = {
        "w1": [0.0] * 48,
        "b1": [0.0] * 8,
        "w2": [0.0] * 8,
        "b2": [0.0],
    }
    resp = client.post("/api/fl/updates", json={"delta": delta, "sample_count": 1})
    assert resp.status_code == 200
    result = resp.json()
    assert result["status"] == "accepted"
    assert "version" in result


def test_fl_update_invalid_dimensions():
    delta = {
        "w1": [0.0] * 10,
        "b1": [0.0] * 8,
        "w2": [0.0] * 8,
        "b2": [0.0],
    }
    resp = client.post("/api/fl/updates", json={"delta": delta, "sample_count": 1})
    assert resp.status_code == 422
