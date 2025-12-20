const BASE_URL = "http://164.90.145.135:8080/api";

export async function fetcher(url: string, options?: RequestInit) {
  try {
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

    if (res.status === 204) return null;

    return res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
}

export async function binaryFetcher(
  url: string,
  options?: RequestInit
): Promise<Blob> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Binary fetch error:", text);
    throw new Error(text);
  }

  const contentType = res.headers.get("content-type");

  if (!contentType?.includes("image")) {
    throw new Error("Response is not image");
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
    throw new Error(text || "File download failed");
  }

  return res.blob(); 
}
