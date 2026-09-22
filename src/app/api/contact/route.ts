import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please provide a valid email address").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      return NextResponse.json(
        { ok: false, error: "Validation failed", fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    await db.contactMessage.create({ data: { name, email, message } });

    return NextResponse.json({
      ok: true,
      message:
        "Message received and stored. Email delivery is not configured yet, so replies will not be automatic.",
    });
  } catch (error) {
    console.error("[contact] failed to store message:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong while saving your message. Please try again." },
      { status: 500 }
    );
  }
}
