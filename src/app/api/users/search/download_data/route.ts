import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";
import { CenterOrOnline, User } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
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

    const users = await prisma.user.findMany({
      where: {
        center_or_online: filter,
        grade,
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "Full Name", key: "full_name", width: 20 },
      { header: "Student Phone", key: "student_phone", width: 15 },
      { header: "Parent Phone", key: "parent_phone", width: 15 },
      { header: "Grade", key: "grade", width: 10 },
      { header: "Governorate", key: "governorate", width: 10 },
      { header: "Email", key: "email", width: 20 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "Center or Online", key: "center_or_online", width: 20 },
    ];

    users.forEach((user: User) => {
      worksheet.addRow({
        full_name: user.full_name,
        student_phone: user.student_phone,
        parent_phone: user.parent_phone,
        governorate: user.governorate,
        grade: user.grade,
        email: user.email,
        gender: user.gender,
        center_or_online: user.center_or_online,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition": 'attachment; filename="users.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.log("GET USERS DATA:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}
