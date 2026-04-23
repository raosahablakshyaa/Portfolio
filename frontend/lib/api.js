const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export async function apiFetch(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      cache: "no-store"
    });
  } catch (error) {
    throw new Error(
      "Backend unreachable. Make sure the API server is running on http://localhost:5001 and then refresh this page."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export { API_URL };
