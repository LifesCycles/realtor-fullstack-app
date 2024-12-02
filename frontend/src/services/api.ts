/**
 * API Service for the Realtor App
 * Handles all HTTP requests to the backend API
 * @module ApiService
 */

import axios from 'axios';
import { Property } from '../types/property';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * API service object containing all API endpoints
 */
const api = {
  /**
   * Fetch all properties with optional filtering
   * @async
   * @param {Object} params - Query parameters for filtering
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.limit] - Number of items per page
   * @param {string} [params.sort] - Sort field
   * @param {string} [params.order] - Sort order (asc/desc)
   * @returns {Promise<Property[]>} Array of property objects
   * @throws {Error} If the API request fails
   */
  getProperties: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
  }): Promise<Property[]> => {
    const response = await axios.get(`${API_URL}/properties`, { params });
    return response.data;
  },

  /**
   * Fetch a single property by ID
   * @async
   * @param {string} id - Property ID
   * @returns {Promise<Property>} Property object
   * @throws {Error} If the property is not found or request fails
   */
  getProperty: async (id: string): Promise<Property> => {
    const response = await axios.get(`${API_URL}/properties/${id}`);
    return response.data;
  },

  /**
   * Create a new property listing
   * @async
   * @param {Omit<Property, 'id'>} property - Property data without ID
   * @returns {Promise<Property>} Created property object
   * @throws {Error} If validation fails or request fails
   */
  createProperty: async (property: Omit<Property, 'id'>): Promise<Property> => {
    const response = await axios.post(`${API_URL}/properties`, property);
    return response.data;
  }
};

export default api;