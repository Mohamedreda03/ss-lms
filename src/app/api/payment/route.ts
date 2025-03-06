import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const addDaysToCurrent = (days: number) => {
      const currentTime = new Date();
      currentTime.setDate(currentTime.getDate() + days);
      return currentTime;
    };

    const expireDate = addDaysToCurrent(7);

    console.log("expireDate:", expireDate);

    const payment = await prisma.payment.create({
      data: {
        amount: body.amount.toString(),
        userId: user.id,
        expire_date: expireDate,
        invoice_id: body.invoice_id,
        invoice_ref: body.invoice_ref,
        status: "UNPAID",
      },
    });

    return NextResponse.json({ data: payment }, { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      where: {
        userId: session?.user.id,
        expire_date: {
          lte: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ payments, session });
  } catch (error) {
    console.log("PAYMENT GET ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.payment.deleteMany({
      where: {
        userId: session?.user.id,
        status: "UNCREATED",
      },
    });

    return new NextResponse("Payment deleted", { status: 200 });
  } catch (error) {
    console.log("PAYMENT DELETE ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
