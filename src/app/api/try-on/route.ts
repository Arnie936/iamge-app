import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["image/jpeg", "image/webp", "image/png"];

export async function POST(request: NextRequest) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Server misconfiguration: webhook URL not set." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data." },
      { status: 400 }
    );
  }

  const image1 = formData.get("image1");
  const image2 = formData.get("image2");

  if (!(image1 instanceof File) || !(image2 instanceof File)) {
    return NextResponse.json(
      { error: "Two image files are required (image1, image2)." },
      { status: 400 }
    );
  }

  // Validate file types
  for (const file of [image1, image2]) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Accepted: JPEG, PNG, WebP.` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File "${file.name}" exceeds the 10 MB size limit.` },
        { status: 400 }
      );
    }
  }

  // Forward to n8n webhook
  const outgoing = new FormData();
  outgoing.append("image1", image1);
  outgoing.append("image2", image2);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: outgoing,
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${response.status}` },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Unexpected response from processing service." },
        { status: 502 }
      );
    }

    const blob = await response.arrayBuffer();
    return new NextResponse(blob, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Processing timed out. Please try again." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Failed to reach processing service." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
