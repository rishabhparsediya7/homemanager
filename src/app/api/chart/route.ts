import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ExpenseTypeArray, weekdays } from "@/lib/constants";
import { getMonthDates } from "@/utils/getCurrentWeek";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    const { email, weekArray } = reqBody;
    const client = await clientPromise;
    const db = client.db("test");
    const start = weekArray[0].split("-");
    const end = weekArray[weekArray.length - 1].split("-");
    let startDate = new Date(
        `${start[2]}-${start[1].padStart(2, "0")}-${start[0].padStart(2, "0")}`
      ).toISOString(),
      endDate = new Date(
        `${end[2]}-${end[1].padStart(2, "0")}-${end[0].padStart(2, "0")}`
      ).toISOString();
    const pipeline = [
      {
        $match: {
          email: email,
          expenseFilter: {
            $elemMatch: {
              date: {
                $gte: startDate,
                $lt: endDate,
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          expenseFilter: {
            $filter: {
              input: "$expenseFilter",
              as: "expenses",
              cond: {
                $and: [
                  {
                    $gte: ["$$expenses.date", startDate],
                  },
                  {
                    $lt: ["$$expenses.date", endDate],
                  },
                ],
              },
            },
          },
        },
      },
    ];

    const result = await db
      .collection("homemanagerexpense")
      .aggregate(pipeline)
      .toArray();
    let dateArray = weekArray.map((date: any) => {
      const d = date.split("-");
      return `${d[2]}-${d[1]}-${d[0]}T00:00:00.000Z`;
    });
    const weekData: number[] = [];
    if (result.length !== 0 && result[0].expenseFilter !== undefined) {
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

      for (var i = 0; i < 7; i++) {
        if (dataList.includes(dateArray[i])) {
          const value = groupArray[dateArray[i]];
          const sum = value.reduce(
            (acc: any, curr: any) => curr.amount + acc,
            0
          );
          weekData.push(sum);
        } else weekData.push(0);
      }
    } else {
      for (var i = 0; i < 7; i++) {
        weekData.push(0);
      }
    }
    return NextResponse.json({ weekArray: weekData }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Failure" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const monthArray = getMonthDates();
    const client = await clientPromise;
    const db = client.db("test");
    let pipeline;
    const type = searchParams.get("type");
    if (type === "month" || type === "expenseType") {
      const email = searchParams.get("email");
      const start = monthArray[0].split("-");
      const end = monthArray[monthArray.length - 1].split("-");
      let startDate = new Date(
          `${start[2]}-${start[1].padStart(2, "0")}-${start[0].padStart(
            2,
            "0"
          )}`
        ).toISOString(),
        endDate = new Date(
          `${end[2]}-${end[1].padStart(2, "0")}-${end[0].padStart(2, "0")}`
        ).toISOString();
      pipeline = [
        {
          $match: {
            email: email,
            expenseFilter: {
              $elemMatch: {
                date: {
                  $gte: startDate,
                  $lt: endDate,
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            expenseFilter: {
              $filter: {
                input: "$expenseFilter",
                as: "expenses",
                cond: {
                  $and: [
                    {
                      $gte: ["$$expenses.date", startDate],
                    },
                    {
                      $lt: ["$$expenses.date", endDate],
                    },
                  ],
                },
              },
            },
          },
        },
      ];
    }
    const result = await db
      .collection("homemanagerexpense")
      .aggregate(pipeline)
      .toArray();
    if (result.length === 0 || result[0].expenseFilter === undefined) {
      return NextResponse.json({ result: [] });
    }
    return NextResponse.json({ result: result[0].expenseFilter });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
