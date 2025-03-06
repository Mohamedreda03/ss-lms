import { prisma } from "@/lib/prisma";
import { CenterOrOnline } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get("name") as string;
    const phone = req.nextUrl.searchParams.get("phone") as string;

    const student_phone = phone.length > 0 ? phone : undefined;

    const page = Number(req.nextUrl.searchParams.get("page") || "1");
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize") || "10");
    let filter = req.nextUrl.searchParams.get("filter") as
      | CenterOrOnline
      | "null"
      | "undefined"
      | undefined;

    let grade = req.nextUrl.searchParams.get("grade") as
      | "1"
      | "2"
      | "3"
      | "undefined"
      | "null"
      | undefined;

    if (filter === "null" || filter === "undefined") {
      filter = undefined;
    }
    if (grade === "null" || grade === "undefined") {
      grade = undefined;
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        where: {
          full_name: {
            startsWith: name,
            mode: "insensitive",
          },
          center_or_online: filter,
          student_phone: {
            startsWith: student_phone,
          },
          grade,
        },
        orderBy: {
          full_name: "asc",
        },
        skip,
        take,
      }),
      prisma.user.count({
        where: {
          full_name: {
            startsWith: name,
            mode: "insensitive",
          },
          center_or_online: filter,
          student_phone: {
            startsWith: student_phone,
          },
          grade,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalUsers / pageSize);

    return NextResponse.json({
      data: users,
      meta: {
        totalUsers,
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
