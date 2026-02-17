/**
 * API Configuration Utility
 * Handles API base URLs with proxy support for development
 */

/**
 * Get the API base URL
 * In development: Uses proxy to avoid CORS issues
 * In production: Uses the full API URL
 */
export const getApiBaseUrl = () => {
  // if (process.env.NODE_ENV === "development") {
  //   return "/api";
  // }
  return process.env.VUE_APP_API_BASE_URL + "/api";
};

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = () => {
  return localStorage.getItem("token");
};

/**
 * Common axios config with authentication
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, alertify) => {
  console.error("API Error:", error);

  if (error.response) {
    // Server responded with error
    const errorMsg =
      error.response.data?.message ||
      error.response.data?.title ||
      error.response.statusText;
    console.error("Response data:", error.response.data);
    return errorMsg;
  } else if (error.request) {
    // Request made but no response
    return "لم يتم الاتصال بالسيرفر. تحقق من الاتصال بالإنترنت";
  } else {
    // Something else happened
    return "حدث خطأ غير متوقع";
  }
};
