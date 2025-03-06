import { isAdmin } from "@/actions/isAdmin";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionTypes } from "@/utils/actionsTypes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let body = await req.json();
    const { userId, courseId, action, price } = body;
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.history.create({
      data: {
        userId,
        courseId,
        action,
        price,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log("ERROR IN POST TEST:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await isAdmin();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const name = req.nextUrl.searchParams.get("name") as string;
    const phone = req.nextUrl.searchParams.get("phone") as string;

    const student_phone = phone.length > 0 ? phone : undefined;

    const page = Number(req.nextUrl.searchParams.get("page") || "1");
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize") || "10");
    let filter = req.nextUrl.searchParams.get("filter") as
      | ActionTypes
      | "null"
      | "undefined"
      | undefined;

    if (filter === "null" || filter === "undefined") {
      filter = undefined;
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [history, totalHistory] = await Promise.all([
      prisma.history.findMany({
        where: {
          user: {
            student_phone: {
              startsWith: student_phone,
              mode: "insensitive",
            },
            full_name: {
              contains: name,
              mode: "insensitive",
            },
          },
          action: filter,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
        include: {
          user: {
            select: {
              full_name: true,
              student_phone: true,
            },
          },
        },
      }),
      prisma.history.count({
        where: {
          user: {
            student_phone: {
              startsWith: student_phone,
              mode: "insensitive",
            },
            full_name: {
              contains: name,
              mode: "insensitive",
            },
          },
          action: filter,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalHistory / pageSize);

    return NextResponse.json({
      data: history,
      meta: {
        totalHistory,
        totalPages,
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    console.log("GET USERS DATA:", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
