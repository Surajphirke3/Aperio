import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  mockStats,
  mockAnomalies,
  mockBatches,
  mockVendors,
  mockCarbonData,
  getMockChatResponse
} from './mockData';

const LOCAL_IP = '10.120.134.235';
export const API_URL = `http://${LOCAL_IP}:8000/v1`;

const USE_MOCK_DATA = true;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export async function setAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem('auth_token', token);
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem('auth_token');
}

export async function getSessionId(): Promise<string> {
  let sessionId = await AsyncStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    await AsyncStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
}

export async function clearSessionId(): Promise<void> {
  await AsyncStorage.removeItem('chat_session_id');
}

export async function fetchFromAPI(endpoint: string, options: any = {}) {
  if (USE_MOCK_DATA) {
    return getMockResponse(endpoint, options);
  }

  try {
    const response = await apiClient({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      ...options,
    });
    return response.data;
  } catch (error: any) {
    console.log('API Error, using mock data:', error.message);
    return getMockResponse(endpoint, options);
  }
}

function getMockResponse(endpoint: string, options: any) {
  if (endpoint === '/stats/' || endpoint === '/stats') {
    return mockStats;
  }

  if (endpoint === '/anomalies/') {
    return mockAnomalies;
  }

  if (endpoint === '/batches/' || endpoint.startsWith('/batches')) {
    if (endpoint.includes('/') && !endpoint.endsWith('/batches/')) {
      const batchId = endpoint.split('/').pop();
      return mockBatches.find(b => b.id === batchId || b.batch_id === batchId) || mockBatches[0];
    }
    return { batches: mockBatches, count: mockBatches.length };
  }

  if (endpoint === '/vendors/' || endpoint.startsWith('/vendors')) {
    return { vendors: mockVendors, count: mockVendors.length };
  }

  if (endpoint === '/carbon/' || endpoint === '/carbon/summary') {
    return mockCarbonData;
  }

  if (endpoint === '/chat/sessions' || endpoint === '/chat/sessions/') {
    return { sessions: [], count: 0 };
  }

  return null;
}

export async function sendChatMessage(message: string, sessionId?: string) {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockChatResponse(message);
  }

  const sid = sessionId || await getSessionId();
  try {
    return await fetchFromAPI('/chat/', {
      method: 'POST',
      body: JSON.stringify({ message, session_id: sid }),
    });
  } catch (error) {
    console.log('Chat API error, using mock response');
    return getMockChatResponse(message);
  }
}

export async function getChatHistory(sessionId?: string) {
  if (USE_MOCK_DATA) {
    return { messages: [], count: 0 };
  }

  const sid = sessionId || await getSessionId();
  try {
    return await fetchFromAPI(`/chat/sessions/${sid}/history`);
  } catch (error) {
    return { messages: [], count: 0 };
  }
}

export async function clearChatSession(sessionId?: string) {
  if (USE_MOCK_DATA) {
    await clearSessionId();
    return { message: 'Session cleared' };
  }

  const sid = sessionId || await getSessionId();
  try {
    const result = await fetchFromAPI(`/chat/sessions/${sid}`, {
      method: 'DELETE',
    });
    await clearSessionId();
    return result;
  } catch (error) {
    await clearSessionId();
    return { message: 'Session cleared' };
  }
}

export async function listChatSessions() {
  if (USE_MOCK_DATA) {
    return { sessions: [], count: 0 };
  }

  try {
    return await fetchFromAPI('/chat/sessions');
  } catch (error) {
    return { sessions: [], count: 0 };
  }
}
