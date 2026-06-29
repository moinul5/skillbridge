import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT/Firebase token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('tm_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unified services
export const itemService = {
  getAll: async (params?: any) => {
    const res = await apiClient.get('/items', { params });
    return res.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get(`/items/${id}`);
    return res.data.data;
  },
  create: async (data: any) => {
    const res = await apiClient.post('/items', data);
    return res.data.data;
  },
  update: async (id: string, data: any) => {
    const res = await apiClient.patch(`/items/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/items/${id}`);
    return res.data;
  }
};

export const bookingService = {
  getAll: async () => {
    const res = await apiClient.get('/bookings');
    return res.data.data;
  },
  getById: async (id: string) => {
    const res = await apiClient.get(`/bookings/${id}`);
    return res.data.data;
  },
  create: async (data: any) => {
    const res = await apiClient.post('/bookings', data);
    return res.data.data;
  },
  updateStatus: async (id: string, status: string) => {
    const res = await apiClient.patch(`/bookings/${id}`, { status });
    return res.data.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/bookings/${id}`);
    return res.data;
  }
};

export const reviewService = {
  getByItem: async (itemId: string) => {
    const res = await apiClient.get('/reviews', { params: { itemId } });
    return res.data.data;
  },
  create: async (data: { itemId: string; rating: number; comment: string }) => {
    const res = await apiClient.post('/reviews', data);
    return res.data.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/reviews/${id}`);
    return res.data;
  }
};

export const userService = {
  getProfile: async () => {
    const res = await apiClient.get('/users/me');
    return res.data.data;
  },
  updateProfile: async (data: any) => {
    const res = await apiClient.patch('/users/me', data);
    return res.data.data;
  },
  getAll: async () => {
    const res = await apiClient.get('/users');
    return res.data.data;
  },
  updateRole: async (id: string, role: string) => {
    const res = await apiClient.patch(`/users/${id}/role`, { role });
    return res.data.data;
  }
};

export const analyticsService = {
  getOverview: async () => {
    const res = await apiClient.get('/analytics/overview');
    return res.data.data;
  },
  getCharts: async () => {
    const res = await apiClient.get('/analytics/charts');
    return res.data.data;
  }
};

export const aiService = {
  generateTripPlan: async (data: {
    destination: string;
    budget: string;
    startDate: string;
    endDate: string;
    guests: number;
    interests: string[];
    travelStyle: string;
  }) => {
    const res = await apiClient.post('/ai/trip-planner', data);
    return res.data.data;
  },
  getRecommendations: async () => {
    const res = await apiClient.post('/ai/recommendations');
    return res.data.data;
  },
  generateListingDescription: async (data: {
    name: string;
    category: string;
    location: string;
    duration: number;
  }) => {
    const res = await apiClient.post('/ai/listing-description', data);
    return res.data.data;
  }
};

export default apiClient;
