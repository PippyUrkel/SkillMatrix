"""
Federated Learning Service — FedAvg Aggregation

Manages global model weights and aggregates client updates
using the Federated Averaging (FedAvg) algorithm.

Weights are stored in-memory (singleton). For production,
persist to Redis or Appwrite.
"""
import logging
import math
import threading
from typing import Optional

logger = logging.getLogger(__name__)

# ── Default weights (must match AdaptiveBrain.ts) ────


def _default_weights() -> dict:
    """Create default weights matching the TypeScript AdaptiveBrain init."""
    w1: list[float] = []
    b1: list[float] = [0.0] * 8
    w2: list[float] = []
    b2: list[float] = [0.0]

    scale1 = math.sqrt(2 / 6)
    for i in range(48):
        w1.append((math.sin(i * 2654435761) * 10000) % 1 * scale1)

    scale2 = math.sqrt(2 / 8)
    for i in range(8):
        w2.append((math.sin(i * 2654435761 + 100) * 10000) % 1 * scale2)

    return {"w1": w1, "b1": b1, "w2": w2, "b2": b2}


# ── Singleton Service ────────────────────────────────


class FLService:
    """Manages global model state and FedAvg aggregation."""

    _instance: Optional["FLService"] = None
    _lock = threading.Lock()

    def __new__(cls) -> "FLService":
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
            return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self._initialized = True

        self.global_weights = _default_weights()
        self.version = 0
        self.total_contributors = 0
        self._pending_updates: list[dict] = []
        self._update_lock = threading.Lock()

        logger.info("FL Service initialized with default global weights")

    # ── Public API ────────────────────────────────

    def get_global_model(self) -> dict:
        """Return current global weights, version, and contributor count."""
        return {
            "weights": self.global_weights.copy(),
            "version": self.version,
            "total_contributors": self.total_contributors,
        }

    def submit_update(self, delta: dict, sample_count: int) -> dict:
        """
        Accept a weight delta from a client.

        Args:
            delta: {"w1": [...], "b1": [...], "w2": [...], "b2": [...]}
            sample_count: Number of training samples the client used

        Returns:
            Status dict with current version and pending count.
        """
        with self._update_lock:
            self._pending_updates.append({
                "delta": delta,
                "sample_count": sample_count,
            })
            pending_count = len(self._pending_updates)

        logger.info(
            "Received weight update (samples=%d). Pending: %d",
            sample_count,
            pending_count,
        )

        # Auto-aggregate after every update (simple strategy)
        # In production, you might wait for N updates before aggregating.
        self._aggregate()

        return {
            "status": "accepted",
            "version": self.version,
            "pending_updates": 0,
        }

    # ── FedAvg Aggregation ────────────────────────

    def _aggregate(self) -> None:
        """
        Apply Federated Averaging to pending updates.

        FedAvg formula:
            W_global_new = W_global + (1/N) * Σ (sample_i / total_samples) * ΔW_i

        Sample-weighted averaging gives more influence to clients
        with more training data.
        """
        with self._update_lock:
            if not self._pending_updates:
                return

            updates = self._pending_updates.copy()
            self._pending_updates.clear()

        total_samples = sum(u["sample_count"] for u in updates)

        if total_samples == 0:
            return

        # Weight keys to aggregate
        keys = ["w1", "b1", "w2", "b2"]

        for key in keys:
            length = len(self.global_weights[key])
            aggregated_delta = [0.0] * length

            for update in updates:
                weight = update["sample_count"] / total_samples
                for i in range(length):
                    aggregated_delta[i] += weight * update["delta"][key][i]

            # Apply aggregated delta to global weights
            for i in range(length):
                self.global_weights[key][i] += aggregated_delta[i]

        self.version += 1
        self.total_contributors += len(updates)

        logger.info(
            "FedAvg aggregation complete. Version: %d, Contributors: %d",
            self.version,
            self.total_contributors,
        )
