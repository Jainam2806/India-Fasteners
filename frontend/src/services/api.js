/**
 * API Service for India Fasteners Backend
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[API Error]', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

/**
 * Fastener Types API
 */
export const fastenerTypesAPI = {
    getAll: async () => {
        const response = await api.get('/api/fastener-types');
        return response.data.fastener_types;
    },

    getById: async (typeId) => {
        const response = await api.get(`/api/fastener-types/${typeId}`);
        return response.data;
    },
};

/**
 * Materials API
 */
export const materialsAPI = {
    getAll: async () => {
        const response = await api.get('/api/materials');
        return response.data.materials;
    },

    getById: async (materialId) => {
        const response = await api.get(`/api/materials/${materialId}`);
        return response.data;
    },
};

/**
 * Dimensions API
 */
export const dimensionsAPI = {
    get: async (fastenerType) => {
        const response = await api.get(`/api/dimensions/${fastenerType}`);
        return response.data;
    },

    getDiameters: async (fastenerType) => {
        const response = await api.get(`/api/diameters/${fastenerType}`);
        return response.data.diameters;
    },
};

/**
 * Calculator API
 */
export const calculatorAPI = {
    calculateWeight: async (params) => {
        const response = await api.post('/api/calculate/weight', params);
        return response.data;
    },

    calculatePieces: async (params) => {
        const response = await api.post('/api/calculate/pieces', params);
        return response.data;
    },

    getDiagramData: async (fastenerType, diameter) => {
        const response = await api.get(`/api/diagram/${fastenerType}/${diameter}`);
        return response.data;
    },
};

/**
 * HSN Codes API
 */
export const hsnAPI = {
    getAll: async () => {
        const response = await api.get('/api/hsn-codes');
        return response.data.hsn_codes;
    },

    search: async (query) => {
        const response = await api.get(`/api/hsn-codes/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    getByCode: async (code) => {
        const response = await api.get(`/api/hsn-codes/${code}`);
        return response.data;
    },
};

/**
 * GST Rates API
 */
export const gstAPI = {
    getRates: async () => {
        const response = await api.get('/api/gst-rates');
        return response.data;
    },

    getByMaterial: async (materialType) => {
        const response = await api.get(`/api/gst-rates/${materialType}`);
        return response.data;
    },
};

/**
 * Standards API
 */
export const standardsAPI = {
    getAll: async () => {
        const response = await api.get('/api/standards');
        return response.data.standards;
    },

    getForFastener: async (fastenerType) => {
        const response = await api.get(`/api/standards/${fastenerType}`);
        return response.data;
    },

    getInfo: async (code) => {
        const response = await api.get(`/api/standards/info/${code}`);
        return response.data;
    },
};

export default api;
