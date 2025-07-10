import request from '../api';

export const refreshToken = (refreshToken: string) =>
  request('/token/refresh', 'POST', { token: refreshToken });

export const logout = (refreshToken: string) =>
  request('/token/logout', 'POST', { token: refreshToken });
