import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { weekdays } from "@/lib/constants";
import { getMonthDates } from "@/utils/getCurrentWeek";

type reduceType = {
  amount: string;
  name: string;
  expenseType: string;
};
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { email, weekArray } = reqBody;
    const client = await clientPromise;
    const db = client.db("test");

    let startDate = weekArray[0],
      endDate = weekArray[weekArray.length - 1];
    const query = {
      $and: [
        {
          expenseFilter: {
            $elemMatch: {
              date: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
        },
        {
          email: email,
        },
      ],
    };
    const collection = db.collection("homemanagerexpense");
    const result = await collection.find(query).toArray();
    const groupArray = result[0].expenseFilter.reduce(
      (group: any, expense: any) => {
        const { date } = expense;
        group[date] = group[date] ?? [];
        group[date].push(expense);
        return group;
      },
      {}
    );
    const dataList = Object.keys(groupArray).sort();
    const weekData: number[] = [];
    for (var i = 0; i < 7; i++) {
      if (dataList.includes(weekArray[i])) {
        const value = groupArray[weekArray[i]];
        const sum = value.reduce((acc: any, curr: any) => curr.amount + acc, 0);
        weekData.push(sum);
      } else weekData.push(0);
    }
    return NextResponse.json({ weekArray: weekData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failure" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const monthArray = getMonthDates();
    const client = await clientPromise;
    const db = client.db("test");
    const collection = db.collection("homemanagerexpense");
    let pipeline;
    const type = searchParams.get("type");
    if (type === "month") {
      const email = searchParams.get("email");
      const date = new Date();
      const start = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).toISOString();

      const end = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1
      ).toISOString();
      pipeline = [
        {
          $project: {
            expenses: {
              $filter: {
                input: "$expenseFilter",
                as: "expense",
                cond: {
                  $and: [
                    { email: email },
                    {
                      $gte: [{ $toDate: "$$expense.date" }, new Date(start)],
                    },
                    {
                      $lte: [{ $toDate: "$$expense.date" }, new Date(end)],
                    },
                  ],
                },
              },
            },
          },
        },
      ];
    } else if (type === "expenseType") {
      const email = searchParams.get("email");
      const date = searchParams.get("date");
      pipeline = [
        { $match: { email: email } },
        { $unwind: "$expenseFilter" },
        { $match: { "expenseFilter.date": date } },
        {
          $group: {
            _id: "$_id",
            matchingExpenses: { $push: "$expenseFilter" },
          },
        },
      ];
    }

    const result = await collection.aggregate(pipeline).toArray();

    if (type === "month") {
      const groupArray = result[0].expenses.reduce(
        (group: any, expense: any) => {
          const { date } = expense;
          group[date] = group[date] ?? [];
          group[date].push(expense);
          return group;
        },
        {}
      );
      const dataList = Object.keys(groupArray).sort();
      const monthData: number[] = [];

      for (var i = 0; i < monthArray.length; i++) {
        if (dataList.includes(monthArray[i])) {
          const value = groupArray[monthArray[i]];
          const sum = value.reduce(
            (acc: any, curr: any) => curr.amount + acc,
            0
          );
          monthData.push(sum);
        } else monthData.push(0);
      }
      return NextResponse.json({ monthData: monthData }, { status: 200 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error);
  }
}