"""
Pydantic schemas for the Federated Learning feature.
"""
from pydantic import BaseModel, Field


class WeightVector(BaseModel):
    """Represents the full weight set of the AdaptiveBrain MLP."""
    w1: list[float] = Field(..., description="Input→Hidden weights (48 values)")
    b1: list[float] = Field(..., description="Hidden biases (8 values)")
    w2: list[float] = Field(..., description="Hidden→Output weights (8 values)")
    b2: list[float] = Field(..., description="Output bias (1 value)")


class WeightUpdateRequest(BaseModel):
    """Client sends weight deltas (local - global) to the server."""
    delta: WeightVector
    sample_count: int = Field(
        ..., ge=1, description="Number of training samples the client used"
    )


class GlobalModelResponse(BaseModel):
    """Server returns the current global model weights."""
    weights: WeightVector
    version: int = Field(..., description="Global model version counter")
    total_contributors: int = Field(
        ..., description="Total clients that have contributed updates"
    )
