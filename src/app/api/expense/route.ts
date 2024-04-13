import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("test");

  try {
    const reqBody = await req.json();
    const { email, ...newItem } = reqBody;
    const response = await db
      .collection("homemanagerexpense")
      .updateOne({ email: email }, { $push: { expenseFilter: newItem } });
    if (response.modifiedCount === 1) {
      return NextResponse.json({ message: "Success" }, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Could not add the Expense" },
        { status: 400 }
      );
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Could not add the Expense" },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const { searchParams } = new URL(req.url);
    const email: string = String(searchParams.get("email"));
    const date: string = String(searchParams.get("date"));
    const response = await db
      .collection("homemanagerexpense")
      .aggregate([
        { $match: { email: email } },
        { $unwind: "$expenseFilter" },
        { $match: { "expenseFilter.date": date } },
        {
          $group: {
            _id: "$_id",
            matchingExpenses: { $push: "$expenseFilter" },
          },
        },
      ])
      .toArray();
    if (response.length === 0 || response[0].matchingExpenses === undefined)
      return NextResponse.json({ expense: [] });
    else return NextResponse.json({ expense: response[0].matchingExpenses });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 404 });
  }
}
