import { isAdmin } from "@/actions/isAdmin";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ActionTypes } from "@/utils/actionsTypes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await isAdmin();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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
          action: filter,
          userId: params.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      }),
      prisma.history.count({
        where: {
          action: filter,
          userId: params.userId,
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
    console.log("GET USER HISTORY DATA:", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
