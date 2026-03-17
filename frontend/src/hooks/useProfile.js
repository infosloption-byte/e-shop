import { useState } from 'react';
import api from '../api/axios';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await api.put('/user/profile', data);
      // Update local storage to keep UI in sync
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async (addressData) => {
    setLoading(true);
    try {
      const res = await api.post('/user/addresses', addressData);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      await api.put('/user/password', passwordData);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, addAddress, changePassword, loading, error };
};