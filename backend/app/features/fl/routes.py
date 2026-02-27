"""
Federated Learning API Routes

GET  /api/fl/model   — Fetch current global model weights
POST /api/fl/updates — Submit client weight deltas
"""
import logging

from fastapi import APIRouter, HTTPException

from app.features.fl.schemas import (
    GlobalModelResponse,
    WeightUpdateRequest,
    WeightVector,
)
from app.features.fl.service import FLService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/fl", tags=["Federated Learning"])


@router.get("/model", response_model=GlobalModelResponse)
async def get_global_model():
    """
    Fetch the current global model weights.

    Clients call this on session start to initialize their local AdaptiveBrain.
    """
    service = FLService()
    model_data = service.get_global_model()
    return GlobalModelResponse(
        weights=WeightVector(**model_data["weights"]),
        version=model_data["version"],
        total_contributors=model_data["total_contributors"],
    )


@router.post("/updates")
async def submit_weight_update(body: WeightUpdateRequest):
    """
    Accept a weight delta from a client.

    The client computes: delta = local_weights - global_weights
    and sends only the delta (no raw user data).

    The server aggregates deltas using FedAvg to improve the
    global model for all users.
    """
    # Validate weight dimensions
    expected_dims = {"w1": 48, "b1": 8, "w2": 8, "b2": 1}
    for key, expected_len in expected_dims.items():
        actual = getattr(body.delta, key)
        if len(actual) != expected_len:
            raise HTTPException(
                status_code=422,
                detail=f"Weight '{key}' has {len(actual)} values, expected {expected_len}",
            )

    service = FLService()
    result = service.submit_update(
        delta={
            "w1": body.delta.w1,
            "b1": body.delta.b1,
            "w2": body.delta.w2,
            "b2": body.delta.b2,
        },
        sample_count=body.sample_count,
    )

    return result
