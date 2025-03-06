import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params: { yearId } }: { params: { yearId: string } }
) {
  try {
    const session = await auth();
    const isUserAuth = session ? true : false;
    const isUserAdmin = session?.user.role === "ADMIN";

    const courses = await prisma.course.findMany({
      where: {
        year: yearId,
      },
    });

    const subscriptions = session
      ? await prisma.subscription.findMany({
          where: {
            userId: session?.user.id,
          },
        })
      : [];

    return NextResponse.json({
      courses,
      subscriptions,
      isUserAdmin,
      isUserAuth,
    });
  } catch (error) {
    console.log("COURSES POST ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
