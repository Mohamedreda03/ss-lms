import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/actions/isAdmin";

export async function GET(req: NextRequest) {
  try {
    const session = await isAdmin();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        price: true,
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.log("Get all courses copons data error:", error);
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
