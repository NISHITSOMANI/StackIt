const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Helper function to handle API responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// API service object
export const api = {
    // Authentication
    login: async (credentials) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();

        // Store token and user data
        if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        }

        return data;
    },

    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Registration failed');
        }

        const data = await response.json();

        // Store token and user data
        if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        }

        return data;
    },

    getCurrentUser: async () => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Token is invalid, clear it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                throw new Error('Authentication failed');
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    // Questions
    getQuestions: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${API_BASE_URL}/questions?${queryString}` : `${API_BASE_URL}/questions`;

        const response = await fetch(url);
        const data = await handleResponse(response);

        // Handle both old format (array) and new format (object with pagination)
        if (Array.isArray(data)) {
            return {
                questions: data,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalQuestions: data.length,
                    hasNext: false,
                    hasPrev: false
                }
            };
        }

        return data;
    },

    getQuestionById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/questions/${id}`);
        return handleResponse(response);
    },

    createQuestion: async (questionData) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/questions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        });
        return handleResponse(response);
    },

    voteQuestion: async (questionId, vote) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/questions/${questionId}/vote`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vote }),
        });
        return handleResponse(response);
    },

    updateQuestion: async (questionId, questionData) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        });
        return handleResponse(response);
    },

    deleteQuestion: async (questionId) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response);
    },

    // Answers
    submitAnswer: async (questionId, answerData) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/questions/${questionId}/answers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answerData),
        });
        return handleResponse(response);
    },

    voteAnswer: async (answerId, vote) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/answers/${answerId}/vote`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vote }),
        });
        return handleResponse(response);
    },

    updateAnswer: async (answerId, answerData) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/answers/${answerId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answerData),
        });
        return handleResponse(response);
    },

    deleteAnswer: async (answerId) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/answers/${answerId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response);
    },

    // Tags
    getTags: async (tagNames = null) => {
        let url = `${API_BASE_URL}/tags`;
        if (tagNames && Array.isArray(tagNames) && tagNames.length > 0) {
            const queryString = new URLSearchParams({ tags: tagNames.join(',') }).toString();
            url = `${API_BASE_URL}/tags?${queryString}`;
        }

        const response = await fetch(url);
        return handleResponse(response);
    },

    getQuestionsByTags: async (tagNames) => {
        if (!Array.isArray(tagNames) || tagNames.length === 0) {
            throw new Error('Tag names must be an array');
        }

        const queryString = new URLSearchParams({ tags: tagNames.join(',') }).toString();
        const url = `${API_BASE_URL}/questions?${queryString}`;

        const response = await fetch(url);
        const data = await handleResponse(response);

        // Handle both old format (array) and new format (object with pagination)
        if (Array.isArray(data)) {
            return {
                questions: data,
                pagination: {
                    currentPage: 1,
                    totalPages: 1,
                    totalQuestions: data.length,
                    hasNext: false,
                    hasPrev: false
                }
            };
        }

        return data;
    },

    // Notifications
    getNotifications: async () => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/notifications`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response);
    },

    markNotificationRead: async (notificationId) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/notifications/read/${notificationId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response);
    },

    // User Profile - Using current user data instead of separate endpoints
    getUserProfile: async (userId) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return handleResponse(response);
    },

    updateUserProfile: async (userId, userData) => {
        const token = getAuthToken();
        if (!token) throw new Error('No authentication token');

        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return handleResponse(response);
    },

    // Health Check
    healthCheck: async () => {
        const response = await fetch(`${API_BASE_URL}/ai-health`);
        return handleResponse(response);
    },
};

// Error handling utility
export const handleApiError = (error) => {
    console.error('API Error:', error);

    if (error.message.includes('401') || error.message.includes('No authentication token')) {
        // Handle authentication errors
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return 'Please log in to continue';
    }

    return error.message || 'An unexpected error occurred';
};

// Loading state utility
export const createLoadingState = () => {
    return {
        loading: false,
        error: null,
        data: null,
    };
}; 