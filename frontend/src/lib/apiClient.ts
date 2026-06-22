import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If we get a 401 Unauthorized, automatically log out the admin
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                // Clear the Next.js frontend session proxy cookie
                document.cookie = "tda_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                // Redirect to login
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
