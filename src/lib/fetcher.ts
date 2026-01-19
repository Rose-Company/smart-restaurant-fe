const BASE_URL = "/api";

export async function fetcher<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const headers = new Headers(options?.headers);
  
  if (!headers.has("Content-Type") && options?.body && typeof options.body === 'string') {
    headers.set("Content-Type", "application/json");
  }
  
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: headers,
  });

  if (res.status === 204) {
    return null as T;
  }

  // Parse JSON response một lần duy nhất
  const data = await res.json();

  // Xử lý HTTP error (4xx, 5xx)
  if (!res.ok) {
    const errorMessage = data.message || data.error_detail || `HTTP ${res.status}`;
    console.error("API Error:", res.status, data);
    throw new Error(errorMessage);
  }
  
  // Kiểm tra nếu API trả về error trong response body
  // (trường hợp HTTP 200 nhưng code !== 200)
  if (data.code && data.code !== 200) {
    throw new Error(data.message || data.error_detail || 'Request failed');
  }

  return data;
}

export async function binaryFetcher(
  url: string,
  options?: RequestInit
): Promise<Blob> {
  const res = await fetch(`${BASE_URL}${url}`, options);

  if (!res.ok) {
    const text = await res.text();
    console.error("Binary fetch error:", text);
    throw new Error(text || "Binary download failed");
  }

  return res.blob();
}

export async function fileFetcher(
  url: string,
  options?: RequestInit
): Promise<Blob> {
  const res = await fetch(`${BASE_URL}${url}`, options);

  if (!res.ok) {
    const text = await res.text();
    console.error("File fetch error:", text);
    throw new Error(text || "File download failed");
  }

  return res.blob();
}