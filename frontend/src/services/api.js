const BASE_URL = 'https://solve.ivy.homes';
const API_KEY = 'IVY26-F487E77DAB9A';

export const apiFetch = async (endpoint, token, options = {}) => {
  const headers = {
    'X-API-Key': API_KEY,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }
    throw new Error(`API call failed: ${response.status}`);
  }

  return response.json();
};

export const normalizePrice = (price) => {
  // From our findings, project prices < 10 are in Crores, >= 10 are in Lacs
  if (price < 10) {
    return price * 10000000;
  }
  return price * 100000;
};

export const formatINR = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};
