import api from './axios';

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  /**
   * POST /auth/login — authenticates credentials, returns { token }.
   */
  login: (credentials) => api.post('/auth/login', credentials),

  /**
   * POST /auth/register — creates a new user account.
   */
  register: (credentials) => api.post('/auth/register', credentials),

  /**
   * POST /auth/google — exchanges a Google token for a JWT.
   */
  googleAuth: (googleToken) => api.post('/auth/google', { token: googleToken }),
};

// ─── Audit ────────────────────────────────────────────────────────────────────
export const auditService = {
  /** Returns all AiAuditLog entities. */
  getLogs: () => api.get('/audit/ai-logs'),

  /** Returns logs where success is false. */
  getFailures: () => api.get('/audit/ai-logs/failures'),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardService = {
  /** Returns totalCalls, successfulLeads, and minutesSaved. */
  getStats: () => api.get('/dashboard/stats'),
};

// ─── Calls ────────────────────────────────────────────────────────────────────
export const callService = {
  /** Sends phoneNumber and rawTranscript for processing. */
  processCall: (phoneNumber, rawTranscript) =>
    api.post('/calls/process', { phoneNumber, rawTranscript }),
};

// ─── Knowledge ────────────────────────────────────────────────────────────────
export const knowledgeService = {
  /** Stores a FAQ entry (question + answer). */
  saveFAQ: (question, answer) =>
    api.post('/knowledge/faq', { question, answer }),

  /** Updates the agent behaviour prompt. */
  updatePrompt: (behavior) =>
    api.put('/knowledge/prompt', { behavior }),
};
