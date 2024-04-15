import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("test");
  const { email, type } = await req.json();
  let loggedIn: boolean;
  if (type === "login") loggedIn = true;
  else if (type === "logout") {
    loggedIn = false;
  } else throw new Error("Could not perform the operation of ", type);
  const result = await db
    .collection("homemanagerexpense")
    .updateOne({ email: email }, { $set: { loggedIn: loggedIn } });
  if (result.modifiedCount === 1) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ ok: false });
  }
}
