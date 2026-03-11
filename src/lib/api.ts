const WEBHOOK_URL =
  "https://n8n.srv804235.hstgr.cloud/webhook/7f5b52e1-8acd-4ffa-b216-a884b2c886d9";

export async function generateTryOn(
  personImage: File,
  clothingImage: File
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const formData = new FormData();
    formData.append("image1", personImage);
    formData.append("image2", clothingImage);

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
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
