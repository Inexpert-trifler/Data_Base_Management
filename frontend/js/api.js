/**
 * API Helper - Centralized API communication
 * Provides reusable methods for all CRUD operations
 */

const API = {
  baseURL: 'http://localhost:8081/api',

  /**
   * Fetch data from API
   */
  async fetch(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';
    
    console.log(`[API] ${method} ${endpoint}`);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      // Log response status
      if (!response.ok) {
        console.error(`[API Error] ${response.status} ${response.statusText}`);
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log(`[API Success] ${method} ${endpoint}`, data);
      return data;
    } catch (error) {
      console.error(`[API Error] ${method} ${endpoint}:`, error.message);
      throw error;
    }
  },

  /**
   * GET all records
   */
  async getAll(resource) {
    return this.fetch(`/${resource}`);
  },

  /**
   * GET single record
   */
  async getOne(resource, id) {
    return this.fetch(`/${resource}/${id}`);
  },

  /**
   * POST new record
   */
  async create(resource, data) {
    return this.fetch(`/${resource}`, {
      method: 'POST',
      body: data
    });
  },

  /**
   * PUT update record
   */
  async update(resource, id, data) {
    return this.fetch(`/${resource}/${id}`, {
      method: 'PUT',
      body: data
    });
  },

  /**
   * DELETE record
   */
  async delete(resource, id) {
    return this.fetch(`/${resource}/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/test`);
      return response.ok;
    } catch {
      return false;
    }
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API;
}
