import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("test");
  const { searchParams } = new URL(req.url);
  const guid = searchParams.get("uuid");
  const email = searchParams.get("email");
  const user = await db
    .collection("homemanagerexpenses")
    .findOne({ guid: guid, email: email });
  if (user) {
    return NextResponse.json({ user: user, ok: true });
  } else {
    return NextResponse.json({ ok: false });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("test");
  const reqBody = await req.json();
  const user = await db
    .collection("homemanagerexpenses")
    .insertOne(reqBody);
  if (user) {
    return NextResponse.json({ user: user, ok: true });
  } else {
    return NextResponse.json({ ok: false });
  }
}
