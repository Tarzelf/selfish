import { NextResponse } from "next/server";

interface GreetRequestBody {
  name?: unknown;
}

export async function POST(request: Request) {
  let body: GreetRequestBody;

  try {
    body = (await request.json()) as GreetRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const rawName = typeof body.name === "string" ? body.name.trim() : "";
  const name = rawName.length > 0 ? rawName : "stranger";

  return NextResponse.json({
    message: `Hello, ${name}! The Selfish dev environment is running.`,
    receivedAt: new Date().toISOString(),
  });
}
