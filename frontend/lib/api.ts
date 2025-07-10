const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'not able to connect';
// const BASE_URL =
//   process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

const request = async (
  endpoint: string,
  method = 'GET',
  body?: any,
  token?: string
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.text(); // try to log raw text
    throw new Error(`Error ${res.status}: ${errorBody}`);
  }
  return res.json();
};

export default request;
