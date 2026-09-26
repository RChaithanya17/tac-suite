const API_BASE_URL = "http://localhost:5000";

interface ApiOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const adminApi = async (
  endpoint: string,
  options: ApiOptions = {}
): Promise<Response> => {
  const { requiresAuth = false, headers, ...fetchOptions } = options;

  const requestHeaders = new Headers(headers);

  if (fetchOptions.body && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      throw new Error("Authentication required");
    }

    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...fetchOptions,
      headers: requestHeaders,
    }
  );

  if (response.status === 401 && requiresAuth) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    window.location.href = "/admin/login";

    throw new Error("Session expired");
  }

  return response;
};