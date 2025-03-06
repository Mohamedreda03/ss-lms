import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ActionTypes } from "@/utils/actionsTypes";

const secretKey = process.env.NEXT_PUBLIC_SHEKE_OUT_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data =
      body.data.invoice_id +
      body.data.amount +
      body.data.invoice_status +
      body.data.updated_at +
      secretKey;

    const computedSignature = crypto
      .createHash("sha256")
      .update(data)
      .digest("hex");

    if (computedSignature === body.signature) {
      const payment = await prisma.payment.findFirst({
        where: {
          invoice_ref: body.data.invoice_ref,
          invoice_id: body.data.invoice_id,
          status: "UNPAID",
        },
      });

      if (!payment) {
        return new NextResponse("No payments", { status: 400 });
      }

      if (body.type === "InvoiceStatusUpdated") {
        if (payment) {
          if (body.data.invoice_status === "paid") {
            const payAfter = await prisma.payment.update({
              where: {
                id: payment?.id,
              },
              data: {
                status: "PAID",
                payment_time: new Date(),
                expire_date: new Date(),
              },
            });

            await prisma.history.create({
              data: {
                userId: payAfter.userId,
                action: ActionTypes.ONLINE_PAYMENT,
                price: Number(payAfter.amount),
              },
            });

            const user = await prisma.user.findUnique({
              where: {
                id: payAfter.userId,
              },
            });
            await prisma.user.update({
              where: {
                id: user?.id,
              },
              data: {
                owned_money: (
                  Number(user?.owned_money || "0") + Number(payAfter.amount)
                ).toString(),
              },
            });
          }
        }
      }
    }
    return new NextResponse("Webhook received", { status: 200 });
  } catch (error) {
    console.log("webhook error:", error);

    return new Response("Internal server error", { status: 500 });
  }
}
