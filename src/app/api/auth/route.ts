import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("test");
  //   const body = await req.json();
  //   console.log(body);
  const { searchParams } = new URL(req.url);
  const guid = searchParams.get("uuid");
  const user = await db.collection("homemanagerexpenses").findOne({ guid: guid });
  if (user) {
    return NextResponse.json({ user: user, ok: true });
  } else {
    return NextResponse.json({ ok: false });
  }
}
