import axios from 'axios';
import { getBrowserFingerprint } from './fingerprint';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------- Debug Interceptors ----------
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 [${config.method?.toUpperCase()}] ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 Response [${response.status}] from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response || error);
    return Promise.reject(error);
  }
);

// ---------- Auth Token Interceptor ----------
apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Encryption ----------
function encryptData(data: string, fingerprint: string): string {
  let encrypted = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ fingerprint.charCodeAt(i % fingerprint.length);
    encrypted += String.fromCharCode(charCode);
  }
  return btoa(encrypted);
}

function decryptData(encryptedData: string, fingerprint: string): string {
  try {
    const data = atob(encryptedData);
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ fingerprint.charCodeAt(i % fingerprint.length);
      decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
  } catch {
    return '';
  }
}

// ---------- Token Storage ----------
export async function setAccessToken(token: string): Promise<void> {
  const fingerprint = await getBrowserFingerprint();
  const encrypted = encryptData(token, fingerprint);
  localStorage.setItem(`access_token_${fingerprint}`, encrypted);
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const fingerprint = await getBrowserFingerprint();
    const encrypted = localStorage.getItem(`access_token_${fingerprint}`);
    if (!encrypted) return null;
    
    return decryptData(encrypted, fingerprint);
  } catch {
    return null;
  }
}

// ---------- Storage ----------
export async function setUserData(userData: Record<string, any>) {
  const fingerprint = await getBrowserFingerprint();
  const encrypted = encryptData(JSON.stringify(userData), fingerprint);
  localStorage.setItem(`user_data_${fingerprint}`, encrypted);
}

export async function getUserData(): Promise<Record<string, any> | null> {
  try {
    const fingerprint = await getBrowserFingerprint();
    const encrypted = localStorage.getItem(`user_data_${fingerprint}`);
    if (!encrypted) return null;

    const decrypted = decryptData(encrypted, fingerprint);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch {
    return null;
  }
}

export async function clearAuthData(): Promise<void> {
  try {
    const fingerprint = await getBrowserFingerprint();
    localStorage.removeItem(`user_data_${fingerprint}`);
    localStorage.removeItem(`access_token_${fingerprint}`);
  } catch {
    localStorage.removeItem('user_data');
    localStorage.removeItem('access_token');
  }
}

// ---------- Helpers ----------
function getNameFromEmail(email: string): string {
  const map: Record<string, string> = {
    'digistarclub@gmail.com': 'Digistar Club',
  };
  return map[email] || email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ---------- Login ----------
export const loginAdmin = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/administrator/login', { email, password });

  const token = response.data?.access_token;
  if (!token) throw new Error('No access token returned');

  // Store access token
  await setAccessToken(token);

  const payload = JSON.parse(atob(token.split('.')[1]));
  const userData = {
    id: payload.sub,
    email: payload.email,
    name: getNameFromEmail(payload.email),
    user_type: payload.role,
  };

  await setUserData(userData);
  window.dispatchEvent(new CustomEvent('auth:admin-login', { detail: { user: userData } }));

  return response.data;
};

// ---------- Logout ----------
export const logoutAdmin = async (): Promise<void> => {
  try {
    await apiClient.delete('/auth/logout');
  } catch (error) {
    console.error('❌ Logout error:', error);
  }

  document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  await clearAuthData();
  window.dispatchEvent(new Event('auth:admin-logout'));
};

export default apiClient;
