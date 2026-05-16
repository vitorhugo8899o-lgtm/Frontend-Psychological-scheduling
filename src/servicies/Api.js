const BASE_URL = import.meta.env.VITE_API_URL;

export const api = async (endpoint, options = {}) => {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const fullUrl = `${BASE_URL}${cleanEndpoint}`;

    const response = await fetch(fullUrl, {
        credentials: 'include',
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.detail || "Erro na requisição");
        error.response = { data: errorData, status: response.status };
        throw error;
    }

    return response;
};
