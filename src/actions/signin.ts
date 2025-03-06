"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const signin = async (data: any) => {
  const user = await prisma.user.findUnique({
    where: {
      student_phone: data.student_phone,
    },
  });

  if (!user) {
    return { error: true, message: "المستخدم غير موجود يرجا انشاء حساب حديد!" };
  }

  const validPassword = await bcrypt.compare(data.password, user.password!);
  if (!validPassword) {
    return { error: true, message: "كلمة المرور غير صحيحة!" };
  }

  await signIn("credentials", {
    student_phone: data.student_phone,
    password: data.password,
    redirectTo: "/",
  });

  return { error: false, message: "تم تسجيل الدخول بنجاح" };
};
