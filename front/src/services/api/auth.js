import api from './api';

export const login = async (username, password) => {
    const response = await api.post('token/', { username, password });
    localStorage.setItem('token', response.data.access);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => {
    return localStorage.getItem('token');
};
