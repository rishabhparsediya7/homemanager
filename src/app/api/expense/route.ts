import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("test");
  const blogs = db.collection("homemanagerexpense").find().toArray();
  console.log(blogs);
  return NextResponse.json("hello world!");
}

// todo : create a post method for submit the expense.
// todo : add google uid as well get token jwt and verify it and do the same thing

export async function POST(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("test");
  const reqBody = await req.json();
  const allItems = await db.collection("homemanagerexpense").find().toArray();
  allItems.push(reqBody);
  const blogs = await db.collection("homemanagerexpense").insertOne(allItems);
  console.log(blogs);
  return NextResponse.json("hello world!");
}
