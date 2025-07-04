// resources/js/Services/notificationService.js
import axios from 'axios'; // Asegúrate de tener axios instalado: npm install axios o yarn add axios

const API_URL = '/api/notifications'; // Ajusta si la URL base de tu API es diferente

// Función para obtener los encabezados de autenticación
// DEBES ADAPTAR ESTO A TU SISTEMA DE AUTENTICACIÓN ACTUAL
const getAuthHeaders = () => {
    // Ejemplo: si usas un token guardado en localStorage
    const token = localStorage.getItem('user_token'); // Reemplaza 'user_token' por la clave real que uses

    if (token) {
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
    } else {
        // Manejar el caso donde no hay token, quizás redirigir al login o lanzar un error.
        // Por ahora, para desarrollo, podrías retornar encabezados vacíos o solo Content-Type,
        // pero en producción necesitarás un token válido.
        console.warn('Token de autenticación no encontrado. Las llamadas a la API podrían fallar.');
        return {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
    }
};

export const getNotifications = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error fetching notifications:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const updateNotificationStatus = async (notificationId, status) => {
    try {
        const response = await axios.post(`${API_URL}/${notificationId}/status`, { status }, getAuthHeaders());
        return response.data; // El backend podría devolver la notificación actualizada
    } catch (error) {
        console.error(`Error updating notification ${notificationId} status:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const addNotificationComment = async (notificationId, comment) => {
    try {
        const response = await axios.post(`${API_URL}/${notificationId}/comments`, { comment }, getAuthHeaders());
        return response.data; // El backend podría devolver el comentario creado o la notificación actualizada
    } catch (error) {
        console.error(`Error adding comment to notification ${notificationId}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

export const getNotificationActions = async (notificationId) => {
    try {
        const response = await axios.get(`${API_URL}/${notificationId}/actions`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error(`Error fetching actions for notification ${notificationId}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// Objeto para exportar todas las funciones, facilitando la importación
const notificationService = {
    getNotifications,
    updateNotificationStatus,
    addNotificationComment,
    getNotificationActions
};

export default notificationService;
