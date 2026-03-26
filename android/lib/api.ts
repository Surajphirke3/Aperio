import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Backend URL - UPDATE THIS to your computer's local IP for physical devices
// Use 10.0.2.2 for Android emulator, localhost for iOS sim, or your actual IP for physical devices
const LOCAL_IP = process.env.EXPO_PUBLIC_BACKEND_IP || '10.0.2.2'; // <-- UPDATE THIS to your computer's IP

export const API_URL = Platform.OS === 'android' && !__DEV__
  ? `http://${LOCAL_IP}:8000/v1`
  : `http://${LOCAL_IP}:8000/v1`; // Using IP for all connections

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  try {
    const response = await apiClient({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body ? JSON.parse(options.body) : undefined,
      ...options,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

// Chat-specific API functions
export async function sendChatMessage(message: string, sessionId?: string) {
  const sid = sessionId || await getSessionId();
  return fetchFromAPI('/chat/', {
    method: 'POST',
    data: { message, session_id: sid },
  });
}

export async function getChatHistory(sessionId?: string) {
  const sid = sessionId || await getSessionId();
  return fetchFromAPI(`/chat/sessions/${sid}/history`);
}

export async function clearChatSession(sessionId?: string) {
  const sid = sessionId || await getSessionId();
  const result = await fetchFromAPI(`/chat/sessions/${sid}`, {
    method: 'DELETE',
  });
  await clearSessionId();
  return result;
}

export async function listChatSessions() {
  return fetchFromAPI('/chat/sessions');
}
