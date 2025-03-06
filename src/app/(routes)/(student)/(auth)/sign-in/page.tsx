"use client";

import { Button } from "@/components/ui/button";
import { BadgeCheck, BadgeInfo, Key, LoaderCircle, Phone } from "lucide-react";
import Link from "next/link";
import CustomInput from "@/components/CustomInput";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

import { useTransition } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { signIn } from "next-auth/react";

const SigninSchema = z.object({
  student_phone: z
    .string()
    .min(11, "رقم الهاتف يجب ان يكون 11 رقم")
    .max(11, "رقم الهاتف يجب ان يكون 11 رقم"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب ان تكون 8 احرف علي الاقل")
    .max(50, "كلمة المرور يجب ان تكون 50 حرف علي الاكثر"),
});

export const dynamic = "force-dynamic";
export default function SignIn() {
  const [isPanding, startTransition] = useTransition();
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
  });

  const onSubmit = async (data: z.infer<typeof SigninSchema>) => {
    startTransition(async () => {
      await axios
        .post("/api/auth/sign-in", {
          student_phone: data.student_phone,
          password: data.password,
        })
        .then(async (res: any) => {
          if (res.data.error) {
            toast({
              description: (
                <div className="flex items-center gap-3">
                  <BadgeInfo size={18} className="mr-2 text-red-500" />
                  <span>{res.data.message}</span>
                </div>
              ),
            });
            return;
          } else {
            await signIn("credentials", {
              student_phone: data.student_phone,
              password: data.password,
              redirectTo: "/",
            });

            toast({
              description: (
                <div className="flex items-center gap-3">
                  <BadgeCheck size={18} className="mr-2 text-green-500" />
                  <span>{res.data.message}</span>
                </div>
              ),
            });
          }
        });
    });
  };

  return (
    <div className="w-full flex flex-col lg:flex-row">
      <div className="bg-[url(/img/sin.png)] bg-top lg:min-h-[90vh] h-[40vh] w-full lg:max-w-[700px] bg-cover bg-no-repeat" />

      <div className="flex-[1.2] md:p-10 px-5 py-10 flex items-center justify-center mt-8 w-full">
        <div className="max-w-screen-sm w-full min-h-[500px] text-lg">
          <h1 className="text-4xl font-bold mb-4">
            تسجيل <span className="text-secondary">الدخول</span>
          </h1>
          <p className="mb-10 mt-5">
            ادخل علي حسابك بإدخال رقم الهاتف و كلمة المرور المسجل بهم من قبل
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-1">
                  <CustomInput
                    Icon={Phone}
                    placeholder="رقم الهاتف"
                    name="student_phone"
                    control={form.control}
                    error={form.formState.errors.student_phone?.message}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <CustomInput
                    Icon={Key}
                    placeholder="كلمة المرور"
                    type="password"
                    name="password"
                    control={form.control}
                    error={form.formState.errors.password?.message}
                  />
                </div>
              </div>
              <Button variant="link" asChild className="mt-3 mb-4">
                <Link href="/reset">هل نسيت كلمة المرور؟</Link>
              </Button>
              <div className="flex w-full flex-col gap-2">
                <Button
                  variant="secondary"
                  className="h-12 w-full text-lg flex items-center gap-3"
                  disabled={isPanding}
                >
                  <span>
                    {isPanding ? "جاري تسجيل الدخول" : "تسجيل الدخول"}
                  </span>
                  {isPanding && (
                    <LoaderCircle className="animate-spin h-5 w-5" />
                  )}
                </Button>
                <Link href="/sign-up" className="w-fit text-sm">
                  ليس لديك حساب؟{" "}
                  <span className="text-secondary">سجل الان</span>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
