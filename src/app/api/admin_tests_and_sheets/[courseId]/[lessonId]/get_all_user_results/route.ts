import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params: { courseId, lessonId },
  }: { params: { courseId: string; lessonId: string } }
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const name = req.nextUrl.searchParams.get("name") as string;
    const phone = req.nextUrl.searchParams.get("phone") as string;

    const student_phone = phone.length > 0 ? phone : undefined;

    const order = req.nextUrl.searchParams.get("order") as "asc" | "desc";
    const page = Number(req.nextUrl.searchParams.get("page") || "1");
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize") || "10");

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [testUserData, totalTestUserData] = await Promise.all([
      prisma.testUserData.findMany({
        where: {
          lessonId: lessonId,
          isCompleted: true,
          user: {
            full_name: {
              contains: name,
            },
            student_phone: {
              contains: student_phone,
            },
          },
        },
        orderBy: {
          testResult: order,
        },
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              student_phone: true,
              parent_phone: true,
            },
          },
        },
        skip,
        take,
      }),
      prisma.testUserData.count({
        where: {
          lessonId: lessonId,
          isCompleted: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(totalTestUserData / pageSize);

    return NextResponse.json({
      data: testUserData,
      meta: {
        totalTestUserData,
        totalPages,
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    console.log("COURSES GET ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
