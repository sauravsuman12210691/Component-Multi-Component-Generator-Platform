import axios from 'axios';

// ----------------------------
// Token Manager (if not yet defined globally)
// ----------------------------
export const tokenManager = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token: string) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
};

// ----------------------------
// Axios instance with auth
// ----------------------------
// Define base axios instance
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    console.log(token)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Session type
export interface Session {
  _id: string;
  title: string;
  jsx?: string;
  css?: string;
  chatHistory?: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GenerateCodeRequest {
  prompt: string;
  sessionId: string;
  existingCode: {
    jsx: string;
    css: string;
  };
}

export interface GenerateCodeResponse {
  jsx: string;
  css: string;
  message: string;
}

// ----------------------------
// Session API
// ----------------------------

export const sessionAPI = {
  // Create a new session
  createSession: async (title: string): Promise<Session> => {
    const res = await axiosInstance.post('/sessions', { title });
    return res.data;
  },

  // Get all sessions
  getSessions: async (): Promise<Session[]> => {
    const res = await axiosInstance.get('/sessions');
    return res.data;
  },

  // Get a specific session by ID
 getSession: async (sessionId: string): Promise<Session> => {
  const response = await axiosInstance.get(`/sessions/${sessionId}`);
  return response.data;
},

  // Update session
  updateSession: async (id: string, data: Partial<Session>): Promise<Session> => {
    const res = await axiosInstance.put(`/sessions/${id}`, data);
    return res.data;
  },

  // Delete a session
  deleteSession: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/sessions/${id}`);
  },
};
// ----------------------------
// AI Tweak API
// ----------------------------

export interface TweakCodeRequest {
  sessionId: string;
  tweakPrompt: string;
}

export const aiAPI = {
  generateCode: async (request: GenerateCodeRequest): Promise<GenerateCodeResponse> => {
    const response = await axiosInstance.post('/ai/generate', request);
      console.log("AI API response:", response.data);  // <--- add this

    return response.data;
  },

  tweakCode: async (request: TweakCodeRequest): Promise<GenerateCodeResponse> => {
    const response = await axiosInstance.post('/ai/tweak', request);
      console.log("AI API response:", response.data);  // <--- add this

    return response.data;
  }
};

// ----------------------------
// AI Generation API
// ----------------------------
