"use client";

import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  BadgeInfo,
  Key,
  LoaderCircle,
  Mail,
  Phone,
  User2,
} from "lucide-react";
import Link from "next/link";

import { governorates } from "@/lib/data";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const SignupSchema = z
  .object({
    full_name: z
      .string()
      .nonempty("الاسم الكامل مطلوب")
      .regex(/^[\u0600-\u06FF\s]+$/, "الاسم الكامل يجب أن يكون باللغة العربية"),
    student_phone: z
      .string()
      .min(11, {
        message: "يجب ان يكون 11 رقم",
      })
      .max(11, {
        message: "يجب ان يكون 11 رقم",
      })
      .regex(/^\d{11}$/, "يجب أن يكون الرقم باللغة الإنجليزية")
      .regex(/^(010|011|012|015)\d{8}$/, "يجب ان يبدأ ب 01"),
    parent_phone: z
      .string()
      .min(11, {
        message: "يجب ان يكون 11 رقم",
      })
      .max(11, {
        message: "يجب ان يكون 11 رقم",
      })
      .regex(/^\d{11}$/, "يجب أن يكون الرقم باللغة الإنجليزية")
      .regex(/^(010|011|012|015)\d{8}$/, "يجب ان يبدأ ب 01"),
    gender: z.string().nonempty("النوع مطلوب"),
    governorate: z.string().nonempty("المحافظة مطلوبة"),
    grade: z.string().min(1).nonempty("الصف مطلوب"),
    center_or_online: z.string().nonempty("السنتر او الاونلاين مطلوب"),
    email: z.string().email("البريد الالكتروني غير صحيح"),
    password: z
      .string()
      .nonempty("كلمة السر مطلوبة")
      .min(8, "كلمة السر يجب ان تكون 8 احرف على الاقل"),
    re_password: z
      .string()
      .nonempty("تأكيد كلمة السر مطلوبة")
      .min(8, "كلمة السر يجب ان تكون 8 احرف على الاقل"),
  })
  .superRefine(
    ({ re_password, password, student_phone, parent_phone }, ctx) => {
      if (re_password !== password) {
        ctx.addIssue({
          code: "custom",
          message: "كلمة السر غير متطابقة",
          path: ["re_password"],
        });
      }

      if (student_phone === parent_phone) {
        ctx.addIssue({
          code: "custom",
          message: "رقم الهاتف لا يمكن ان يكون متشابه",
          path: ["parent_phone"],
        });
      }
    }
  );

export const dynamic = "force-dynamic";
export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    setIsLoading(true);
    await axios
      .post("/api/auth/sign-up", data)
      .then((res: any) => {
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
          router.push("/sign-in");
          toast({
            description: (
              <div className="flex items-center gap-3">
                <BadgeCheck size={18} className="mr-2 text-green-500" />
                <span>{res.data.message}</span>
              </div>
            ),
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      <div className="bg-[url(/img/sin.png)] bg-top lg:min-h-screen h-[50vh] w-full lg:max-w-[500px] xl:max-w-[700px]  bg-cover bg-no-repeat" />

      <div className="md:flex-[1.2] mx-auto md:p-10 px-5 py-10 flex items-center justify-center h-full mt-8">
        <div className="max-w-screen-sm w-full h-full text-lg">
          <h1 className="text-4xl font-bold mb-4 text-first">
            انشئ <span> حسابك الآن</span>
          </h1>
          <p className="mb-10 mt-5">
            ادخل بياناتك بشكل صحيح للحصول علي افضل تجربة داخل الموقع
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 h-full md:mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="group w-full">
                  <CustomInput
                    error={form.formState.errors.full_name?.message}
                    control={form.control}
                    name="full_name"
                    Icon={User2}
                    placeholder="الاسم رباعي باللغه العربية"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="group w-full">
                  <CustomInput
                    error={form.formState.errors.student_phone?.message}
                    control={form.control}
                    name="student_phone"
                    Icon={Phone}
                    placeholder="رقم الهاتف"
                  />
                </div>
                <div className="group w-full">
                  <CustomInput
                    error={form.formState.errors.parent_phone?.message}
                    control={form.control}
                    name="parent_phone"
                    Icon={Phone}
                    placeholder="رقم ولي الامر"
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      dir="rtl"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl
                        className={cn(
                          "focus-visible:ring-0 focus-visible:ring-offset-0",
                          {
                            "border-red-500": form.formState.errors.gender,
                          }
                        )}
                      >
                        <SelectTrigger className="dark:bg-first/20 dark:border-first">
                          <SelectValue placeholder="النوع" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">ذكر</SelectItem>
                        <SelectItem value="female">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="center_or_online"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      dir="rtl"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl
                        className={cn(
                          "focus-visible:ring-0 focus-visible:ring-offset-0",
                          {
                            "border-red-500": form.formState.errors.gender,
                          }
                        )}
                      >
                        <SelectTrigger className="dark:bg-first/20 dark:border-first">
                          <SelectValue placeholder="طالب سنتر ام اونلاين" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="center">سنتر</SelectItem>
                        <SelectItem value="online">اونلاين</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="governorate"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      dir="rtl"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl
                        className={cn(
                          "focus-visible:ring-0 focus-visible:ring-offset-0",
                          {
                            "border-red-500": form.formState.errors.governorate,
                          }
                        )}
                      >
                        <SelectTrigger className="dark:bg-first/20 dark:border-first">
                          <SelectValue placeholder="المحافظة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">ذكر</SelectItem>
                        {governorates.map((governorate) => (
                          <SelectItem
                            key={governorate.id}
                            value={governorate.governorate_name_ar}
                          >
                            {governorate.governorate_name_ar}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      dir="rtl"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl
                        className={cn(
                          "focus-visible:ring-0 focus-visible:ring-offset-0",
                          {
                            "border-red-500": form.formState.errors.grade,
                          }
                        )}
                      >
                        <SelectTrigger className="dark:bg-first/20 dark:border-first">
                          <SelectValue placeholder="الصف" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="" value="1">
                          الاول الثانوي
                        </SelectItem>
                        <SelectItem value="2">الثاني الثانوي</SelectItem>
                        <SelectItem value="3">الثالث الثانوي</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <CustomInput
                error={form.formState.errors.email?.message}
                control={form.control}
                name="email"
                Icon={Mail}
                placeholder="البريد الالكتروني"
              />

              <div className="flex flex-col md:flex-row gap-8">
                <div className="group w-full">
                  <CustomInput
                    error={form.formState.errors.password?.message}
                    control={form.control}
                    name="password"
                    Icon={Key}
                    placeholder="كلمة السر"
                    type="password"
                  />
                </div>

                <div className="group w-full">
                  <CustomInput
                    error={form.formState.errors.re_password?.message}
                    control={form.control}
                    name="re_password"
                    Icon={Key}
                    placeholder="تأكيد كلمة السر"
                    type="password"
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                <Button
                  variant="secondary"
                  className="h-12 w-full text-lg flex items-center gap-3"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري انشاء الحساب" : "انشاء الحساب !"}

                  {isLoading && (
                    <LoaderCircle className="animate-spin h-5 w-5" />
                  )}
                </Button>

                <Link href="/sign-in" className="w-fit text-sm">
                  يوجد لديك حساب بالفعل؟<span className="mx-1"></span>
                  <span className="text-secondary">ادخل إلى حسابك الآن !</span>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
