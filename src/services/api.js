/**
 * FraudShield AI — API Service Client
 * Handles communication with the FastAPI backend endpoints.
 */

const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = errJson.detail;
      }
    } catch (_) {}
    throw new Error(errorDetail);
  }
  return response.json();
}

export const api = {
  // System Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },

  // Genuine ML Model Evaluation Metrics
  async getMetrics() {
    const res = await fetch(`${API_BASE}/metrics`);
    return handleResponse(res);
  },

  // Executive Dashboard KPIs & Aggregations
  async getOverview() {
    const res = await fetch(`${API_BASE}/overview`);
    return handleResponse(res);
  },

  // Paginated & Filtered Transaction History
  async getTransactions({
    risk_tier = '',
    status = '',
    search = '',
    min_amount = '',
    max_amount = '',
    page = 1,
    limit = 20
  } = {}) {
    const params = new URLSearchParams();
    if (risk_tier && risk_tier !== 'all') params.append('risk_tier', risk_tier);
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);
    if (min_amount !== '' && min_amount !== null && !isNaN(min_amount)) params.append('min_amount', min_amount);
    if (max_amount !== '' && max_amount !== null && !isNaN(max_amount)) params.append('max_amount', max_amount);
    params.append('page', page);
    params.append('limit', limit);

    const res = await fetch(`${API_BASE}/transactions?${params.toString()}`);
    return handleResponse(res);
  },

  // Single Transaction Details
  async getTransaction(id) {
    const res = await fetch(`${API_BASE}/transactions/${id}`);
    return handleResponse(res);
  },

  // Submit Transaction for Live ML Inference
  async analyzeTransaction(transactionData) {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transactionData),
    });
    return handleResponse(res);
  },

  // Update Review Status & Analyst Notes
  async updateStatus(id, status, notes = '') {
    const res = await fetch(`${API_BASE}/transactions/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    return handleResponse(res);
  },

  // Influx Single Simulated Transaction
  async simulateSingle(fraudBias = 0.25) {
    const res = await fetch(`${API_BASE}/simulate/single`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fraud_bias: fraudBias }),
    });
    return handleResponse(res);
  },

  // Limitations Documentation
  async getLimitations() {
    const res = await fetch(`${API_BASE}/dataset/limitations`);
    return handleResponse(res);
  }
};
