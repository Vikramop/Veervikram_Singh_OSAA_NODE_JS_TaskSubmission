import request from '../api';

export const register = (data: {
  username: string;
  passcode: string;
  dob: string;
  referralCode?: string;
}) => request('/auth/register', 'POST', data);

export const login = (data: { username: string; passcode: string }) =>
  request('/auth/login', 'POST', data);

export const verifyOTP = (data: { username: string; otp: string }) =>
  request('/auth/verify-otp', 'POST', data);

export const resendOTP = (username: string) =>
  request('/auth/resend-otp', 'POST', { username });
