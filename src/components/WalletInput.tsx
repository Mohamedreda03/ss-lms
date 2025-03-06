"use client";

import { LoaderCircle, Wallet } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import CustomInput from "./CustomInput";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { getUser } from "@/actions/getUser";

const SigninSchema = z.object({
  amount: z.coerce
    .number({
      message: "المبلغ يجب ان يكون رقم",
    })
    .int("المبلغ يجب ان يكون رقم صحيح")
    .positive("المبلغ يجب ان يكون اكبر من 0")
    .min(10, "المبلغ يجب ان يكون اكبر من 10")
    .max(2000, "المبلغ يجب ان يكون اقل من 2000"),
});

export default function WalletInput({ session }: { session: any }) {
  const [user, setUser] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
  });

  useEffect(() => {
    if (session) {
      getUserData();
    }
  }, [session]);

  const getUserData = async () => {
    try {
      const data = await axios
        .get("/api/auth_user_data")
        .then((res) => res.data);
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  // إنشاء كائن Date جديد للتاريخ الحالي
  const currentDate = new Date();

  // إضافة 7 أيام إلى التاريخ الحالي
  currentDate.setDate(currentDate.getDate() + 7);

  // تنسيق التاريخ الجديد بالشكل المطلوب (YYYY-MM-DD)
  const formattedDate = currentDate.toISOString().split("T")[0];

  const onSubmit = async (dataI: z.infer<typeof SigninSchema>) => {
    setIsLoading(true);
    const data = {
      amount: dataI.amount,
      currency: "EGP",
      due_date: formattedDate,
      customer: {
        first_name: user?.full_name?.split(" ")[0] || "Client",
        last_name: user?.full_name?.split(" ")[1] || "Client",
        email: user?.email || "client@client.com",
        phone: "+2" + user?.student_phone,
        address: "Street 123",
      },
      redirection_urls: {
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet`,
        fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet`,
        pending_url: `${process.env.NEXT_PUBLIC_APP_URL}/wallet`,
      },
      invoice_items: [
        {
          name: "Course",
          price: dataI.amount,
          quantity: 1,
        },
      ],
    };

    await axios
      .post("https://dash.shake-out.com/api/public/vendor/invoice", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `apikey ${process.env.NEXT_PUBLIC_SHEKE_OUT_API_KEY}`,
        },
      })
      .then(async (res) => {
        await axios.post("/api/payment", {
          invoice_id: res.data.data.invoice_id,
          // invoice_id: "wV9A6vDAp5",
          invoice_ref: res.data.data.invoice_ref,
          // invoice_ref: "DThMInliqPpQGdJ0",
          amount: dataI.amount,
          status: "UNPAID",
        });

        router.push(res.data.data.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col-reverse lg:flex-row lg:gap-7 gap-3"
        >
          <Button
            variant="secondary"
            className="h-12 text-lg mt-3 lg:mt-0 bg-blue-500 hover:bg-blue-500/85 text-white"
            disabled={isLoading}
          >
            شحن المحفظة ! (فوري)
            {isLoading && (
              <LoaderCircle className="animate-spin text-white mr-2" />
            )}
          </Button>
          <div className="flex flex-col w-full">
            <CustomInput
              disabled={isLoading}
              className=""
              Icon={Wallet}
              placeholder="المبلغ المراد شحنه"
              name="amount"
              control={form.control}
              error={form.formState.errors.amount?.message}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
