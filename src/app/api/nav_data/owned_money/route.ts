import { getUser } from "@/actions/getUser";
import { isAuth } from "@/actions/isAuth";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
      select: {
        owned_money: true,
      },
    });

    const owned_money = user?.owned_money;

    return NextResponse.json({
      owned_money,
    });
  } catch (error) {
    console.log("NEW PASSWORD PATCH ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
