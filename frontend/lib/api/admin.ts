import request from '../api';

export const getUsers = (token: string) =>
  request('/admin/users', 'GET', undefined, token);

export const updateUserRole = (userId: string, role: string, token: string) =>
  request(`/admin/user/${userId}/role`, 'PATCH', { role }, token);

export const setBanStatus = (userId: string, ban: boolean, token: string) =>
  request(`/admin/user/${userId}/ban`, 'PATCH', { ban }, token);
