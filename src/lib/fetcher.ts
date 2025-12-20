const BASE_URL = "/api";

export async function fetcher<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API Error:", res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json();
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
