import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { visibility?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.visibility !== "public" && body.visibility !== "private") {
    return NextResponse.json(
      { error: "visibility must be 'public' or 'private'." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("fitchecks")
    .update({ visibility: body.visibility })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id, visibility")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Fitcheck not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ fitcheck: data });
}
