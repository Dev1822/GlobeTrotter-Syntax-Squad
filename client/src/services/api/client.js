import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 45000,
});

// Request Interceptor: Attach JWT Token in both supported formats
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("packgo_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

function normalizeIds(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    obj.forEach(normalizeIds);
  } else {
    if (obj.id !== undefined && obj._id === undefined) {
      obj._id = obj.id;
    } else if (obj._id !== undefined && obj.id === undefined) {
      obj.id = obj._id;
    }
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === "object") {
        normalizeIds(obj[key]);
      }
    });
  }
  return obj;
}

// Response Interceptor: Global 401 handling & ID normalization
apiClient.interceptors.response.use(
  (response) => {
    if (response?.data) {
      normalizeIds(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on authentication expiry
      const token = localStorage.getItem("packgo_token");
      if (token) {
        localStorage.removeItem("packgo_token");
        localStorage.removeItem("packgo_user");
        // Dispatch custom event to notify auth context without hard page reload
        window.dispatchEvent(new CustomEvent("packgo_auth_expired"));
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Universal error message extractor for all backend error structures.
 */
export function getErrorMessage(
  error,
  defaultMsg = "An unexpected error occurred. Please try again.",
) {
  if (!error?.response?.data) {
    return error?.message || defaultMsg;
  }
  const data = error.response.data;
  return (
    data.msg ||
    data.message ||
    data.error ||
    data.Message ||
    (typeof data === "string" ? data : defaultMsg)
  );
}

export default apiClient;
