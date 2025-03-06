import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";
import { isAdmin } from "@/actions/isAdmin";

const generateCoupons = async (
  count: number,
  value: number,
  courseId: string
) => {
  const coupons = [];
  const couponData = [];

  for (let i = 0; i < count; i++) {
    let couponCode: string;
    let isUnique = false;

    while (!isUnique) {
      couponCode = uuidv4().slice(0, 18);
      const existingCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode },
      });
      if (!existingCoupon) {
        isUnique = true;
      }
    }

    couponData.push({
      code: couponCode!,
      value,
      isUsed: false,
      user_phone: "",
      courseId,
    });

    coupons.push(`${couponCode!}`);
  }

  await prisma.coupon.createMany({
    data: couponData,
  });

  return coupons;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const session = await isAdmin();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { value, numberOfCoupons, courseId } = body;

    const coupons = await generateCoupons(numberOfCoupons, value, courseId);

    const fileContent = coupons.join("\n");

    return new NextResponse(fileContent, {
      headers: {
        "Content-Disposition": `attachment; filename=coupons-${uuidv4()
          .split("-")
          .join()
          .slice(0, 8)}.txt`,
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.log("Generate coupons error:", error);
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await isAdmin();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const code = req.nextUrl.searchParams.get("code") as string;
    const coupon_code = code.length > 0 ? code : undefined;

    const page = Number(req.nextUrl.searchParams.get("page") || "1");
    const pageSize = Number(req.nextUrl.searchParams.get("pageSize") || "20");

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [coupons, totalCoupons] = await Promise.all([
      prisma.coupon.findMany({
        where: {
          code: {
            startsWith: coupon_code,
            mode: "insensitive",
          },
        },
        skip,
        take,
      }),
      prisma.coupon.count({
        where: {
          code: {
            startsWith: coupon_code,
            mode: "insensitive",
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCoupons / pageSize);

    return NextResponse.json({
      data: coupons,
      meta: {
        totalCoupons,
        totalPages,
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    console.log("Get all coupons error:", error);
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: body.code,
        isUsed: false,
      },
    });

    if (!coupon) {
      return NextResponse.json({
        success: false,
        message: "الكوبون غير صالح",
      });
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: session?.user.id,
      },
    });

    if (!userData) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    let message: string;

    if (coupon.courseId) {
      await prisma.subscription.create({
        data: {
          courseId: coupon.courseId,
          userId: session?.user.id!,
        },
      });

      await prisma.history.create({
        data: {
          price: coupon.value,
          courseId: coupon.courseId,
          userId: session?.user.id!,
          action: "SUBSCRIPTION",
        },
      });

      message = "تم الاشتراك بنجاح";
    } else {
      const updatedMoney = (
        Number(userData?.owned_money) + coupon.value
      ).toString();

      await prisma.user.update({
        where: {
          id: session?.user.id,
        },
        data: {
          owned_money: updatedMoney,
        },
      });

      await prisma.history.create({
        data: {
          price: coupon.value,
          userId: session?.user.id!,
          action: "CENTER_CODE",
        },
      });

      message = "تم اضافة المبلغ بنجاح";
    }

    await prisma.coupon.update({
      where: {
        id: coupon.id,
      },
      data: {
        isUsed: true,
        user_phone: userData?.student_phone!,
      },
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.log("Get all coupons error:", error);
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
