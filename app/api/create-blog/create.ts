import { NextResponse } from "next/server";

export async function GET() {
  return new Response('Create Blog API is working');
}

export async function POST(request: Request) {
  const { title, content } = await request.json();
  // Here you would typically handle the creation logic, e.g., saving to a database
  return NextResponse.json({ message: 'Blog created successfully', title, content, success: true }, { status: 201 });
}
