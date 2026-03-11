const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function generateTryOn(
  personImage: File,
  clothingImage: File
): Promise<string> {
  // Client-side validation
  for (const file of [personImage, clothingImage]) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File "${file.name}" exceeds the 10 MB size limit.`);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const formData = new FormData();
    formData.append("image1", personImage);
    formData.append("image2", clothingImage);

    const response = await fetch("/api/try-on", {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(
        body?.error || `Server error: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      throw new Error("Unexpected response format. Expected an image.");
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
