import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("test");
    const { searchParams } = new URL(req.url);
    const email: string = String(searchParams.get("email"));
    const date: string = String(searchParams.get("date"));
    const d: string = date;

    const expenses = await db
      .collection("homemanagerexpense")
      .find({ email: email }, { projection: { _id: 0, expense: 1 } })
      .toArray();
    if (expenses === undefined) return NextResponse.json({ expense: [] });
    if (
      expenses !== null &&
      expenses !== undefined &&
      expenses[0].expense !== null &&
      expenses[0].expense !== undefined
    ) {
      return NextResponse.json({ expense: expenses[0].expense[d] });
    }
    return NextResponse.json({ expense: [] });
  } catch (error) {
    return NextResponse.json("Could not fetch the expenses");
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  const client = await clientPromise;
  const db = client.db("test");

  try {
    const reqBody = await req.json();
    const { email, date } = reqBody;
    const expenseArray = await db
      .collection("homemanagerexpense")
      .find({ email: email }, { projection: { _id: 0, expense: 1 } })
      .toArray();
    const newItem = {
      name: reqBody.name,
      amount: reqBody.amnt,
      expenseType: reqBody.expenseType,
    };
    const d = date.toString();
    let allItems;
    if (
      expenseArray === undefined ||
      expenseArray[0] === undefined ||
      expenseArray[0].expense === undefined
    ) {
      allItems = {};
    } else {
      allItems = expenseArray[0].expense || {};
    }
    if (allItems[d] === undefined) {
      allItems[d] = [newItem];
    } else {
      allItems[d].push(newItem);
    }
    const result = await db
      .collection("homemanagerexpense")
      .updateOne({ email: email }, { $set: { expense: allItems } });

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "No document found to update" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Could not update the doc" },
      { status: 400 }
    );
  }
}
