import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { email, weekArray } = reqBody;
    const client = await clientPromise;
    const db = client.db("test");
    const result = await db
      .collection("homemanagerexpense")
      .find({ email: email }, { projection: { _id: 0, expense: 1 } })
      .toArray();

    const dataList = [];
    for (const week of weekArray) {
      if (result[0].expense[week] !== undefined) {
        dataList.push(
          result[0].expense[week].reduce(
            (acc: number, curr: number) => parseFloat(curr.amount) + acc,
            0
          )
        );
      } else dataList.push(0);
    }
    return NextResponse.json({ weekArray: dataList }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Failure" }, { status: 400 });
  }
}
