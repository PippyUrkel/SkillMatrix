/**
 * AdaptiveBrain — Lightweight RAM-Only Neural Network
 *
 * A pure-TypeScript 2-layer MLP (Multi-Layer Perceptron) that predicts
 * a learning pace adjustment factor based on user performance signals.
 *
 * Architecture: Input(6) → Hidden(8, ReLU) → Output(1, Sigmoid)
 *
 * Constraints:
 * - Zero external dependencies
 * - Sub-millisecond inference
 * - Fully in-memory (no disk persistence)
 * - Only weight deltas leave the client (for Federated Learning)
 */

// ── Types ───────────────────────────────────────────

export interface BrainWeights {
    w1: number[];   // input→hidden  (6 * 8 = 48 weights)
    b1: number[];   // hidden biases  (8)
    w2: number[];   // hidden→output  (8 * 1 = 8 weights)
    b2: number[];   // output bias    (1)
}

export interface PaceResult {
    pace_factor: number;       // 0.5 (fast learner) → 2.0 (needs more time)
    raw_output: number;        // raw sigmoid output (0-1)
    recommendation: string;    // human-readable recommendation
}

// ── Activation Functions ────────────────────────────

function relu(x: number): number {
    return Math.max(0, x);
}

function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}

// ── Default Weights (pre-initialized) ───────────────
// These represent "neutral" weights where the network
// outputs ~0.5 (normal pace) for average-performing users.

function createDefaultWeights(): BrainWeights {
    const w1: number[] = [];
    const b1: number[] = [];
    const w2: number[] = [];
    const b2: number[] = [0.0];

    // Xavier-ish initialization for input→hidden (6→8)
    const scale1 = Math.sqrt(2 / 6);
    for (let i = 0; i < 48; i++) {
        // Deterministic seed pattern instead of random for reproducibility
        w1.push(((Math.sin(i * 2654435761) * 10000) % 1) * scale1);
    }
    for (let i = 0; i < 8; i++) {
        b1.push(0.0);
    }

    // Xavier-ish initialization for hidden→output (8→1)
    const scale2 = Math.sqrt(2 / 8);
    for (let i = 0; i < 8; i++) {
        w2.push(((Math.sin(i * 2654435761 + 100) * 10000) % 1) * scale2);
    }

    return { w1, b1, w2, b2 };
}

// ── AdaptiveBrain Class ─────────────────────────────

export class AdaptiveBrain {
    private weights: BrainWeights;
    private globalWeights: BrainWeights;

    constructor(weights?: BrainWeights) {
        this.weights = weights ?? createDefaultWeights();
        // Store a copy of the global weights for computing deltas
        this.globalWeights = JSON.parse(JSON.stringify(this.weights));
    }

    // ── Core Inference ──────────────────────────────

    /**
     * Predict a learning pace factor from 6 normalized input signals.
     *
     * @param signals - [quiz_score, time_per_question, attempt_count,
     *                   confidence, mastery_delta, drop_off_rate]
     *                  All values should be in [0, 1] range.
     *
     * @returns PaceResult with factor clamped to [0.5, 2.0]
     */
    predict(signals: number[]): PaceResult {
        if (signals.length !== 6) {
            throw new Error(`Expected 6 input signals, got ${signals.length}`);
        }

        // Layer 1: Input(6) → Hidden(8)
        const hidden: number[] = [];
        for (let j = 0; j < 8; j++) {
            let sum = this.weights.b1[j];
            for (let i = 0; i < 6; i++) {
                sum += signals[i] * this.weights.w1[j * 6 + i];
            }
            hidden.push(relu(sum));
        }

        // Layer 2: Hidden(8) → Output(1)
        let output = this.weights.b2[0];
        for (let j = 0; j < 8; j++) {
            output += hidden[j] * this.weights.w2[j];
        }
        const rawOutput = sigmoid(output);

        // Map sigmoid(0→1) to pace_factor(0.5→2.0)
        const paceFactor = 0.5 + rawOutput * 1.5;

        // Clamp to safe range
        const clamped = Math.max(0.5, Math.min(2.0, paceFactor));

        return {
            pace_factor: Math.round(clamped * 100) / 100,
            raw_output: Math.round(rawOutput * 1000) / 1000,
            recommendation: this.getRecommendation(clamped),
        };
    }

    // ── Local Training (1 epoch, simple gradient) ──

    /**
     * Perform a single training step adjusting weights toward a target pace.
     * This is a simplified gradient descent for the FL use case.
     *
     * @param signals - Input signal vector (length 6)
     * @param targetPace - The "ideal" pace factor (0.5-2.0)
     * @param learningRate - Step size (default 0.01)
     */
    train(signals: number[], targetPace: number, learningRate: number = 0.01): void {
        // Forward pass
        const result = this.predict(signals);

        // Target output in sigmoid space: (targetPace - 0.5) / 1.5
        const targetOutput = Math.max(0, Math.min(1, (targetPace - 0.5) / 1.5));

        // Error
        const error = targetOutput - result.raw_output;

        // Simplified backprop for output layer
        const dOutput = error * result.raw_output * (1 - result.raw_output);

        // Recompute hidden for gradient
        const hidden: number[] = [];
        for (let j = 0; j < 8; j++) {
            let sum = this.weights.b1[j];
            for (let i = 0; i < 6; i++) {
                sum += signals[i] * this.weights.w1[j * 6 + i];
            }
            hidden.push(relu(sum));
        }

        // Update output weights
        for (let j = 0; j < 8; j++) {
            this.weights.w2[j] += learningRate * dOutput * hidden[j];
        }
        this.weights.b2[0] += learningRate * dOutput;

        // Update hidden weights (backprop through ReLU)
        for (let j = 0; j < 8; j++) {
            if (hidden[j] > 0) { // ReLU derivative
                const dHidden = dOutput * this.weights.w2[j];
                for (let i = 0; i < 6; i++) {
                    this.weights.w1[j * 6 + i] += learningRate * dHidden * signals[i];
                }
                this.weights.b1[j] += learningRate * dHidden;
            }
        }
    }

    // ── Federated Learning Helpers ──────────────────

    /**
     * Get the weight delta (local - global) for sending to the FL server.
     * Only deltas leave the client — no raw user data.
     */
    getWeightDelta(): BrainWeights {
        return {
            w1: this.weights.w1.map((w, i) => w - this.globalWeights.w1[i]),
            b1: this.weights.b1.map((b, i) => b - this.globalWeights.b1[i]),
            w2: this.weights.w2.map((w, i) => w - this.globalWeights.w2[i]),
            b2: this.weights.b2.map((b, i) => b - this.globalWeights.b2[i]),
        };
    }

    /**
     * Load new global weights from the server (after FedAvg aggregation).
     */
    loadGlobalWeights(weights: BrainWeights): void {
        this.weights = JSON.parse(JSON.stringify(weights));
        this.globalWeights = JSON.parse(JSON.stringify(weights));
    }

    /**
     * Export current weights for serialization.
     */
    getWeights(): BrainWeights {
        return JSON.parse(JSON.stringify(this.weights));
    }

    // ── Private Helpers ─────────────────────────────

    private getRecommendation(pace: number): string {
        if (pace <= 0.7) return 'accelerated';
        if (pace <= 0.9) return 'slightly_fast';
        if (pace <= 1.1) return 'normal';
        if (pace <= 1.4) return 'slightly_slow';
        return 'extended';
    }
}
