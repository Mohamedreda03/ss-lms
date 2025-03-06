"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { BadgeCheck, BadgeInfo } from "lucide-react";
import { User } from "@prisma/client";
import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { ActionTypes } from "@/utils/actionsTypes";

const FormSchema = z.object({
  role: z.string({
    required_error: "الرجاء اختيار صلاحية المستخدم.",
  }),
  owned_money: z.coerce.number().optional(),
  password: z.string().optional(),
});

interface UpdateUserRoleProps {
  user: User;
}

const roles = [
  { value: "STUDENT", label: "طالب" },
  { value: "ADMIN", label: "مشرف" },
];

export default function UpdateUser({ user }: UpdateUserRoleProps) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      role: user?.role,
      owned_money: 0,
      password: "",
    },
  });

  const {
    mutateAsync: updateUserData,
    isLoading,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: any) => {
      if (data.owned_money) {
        await axios.post("/api/history", {
          userId: user?.id,
          courseId: null,
          price: data?.owned_money,
          action: ActionTypes.CENTER_PAYMENT,
        });
      }

      data.owned_money = Number(user?.owned_money) + data.owned_money!;

      await axios.patch(`/api/users/${user?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);

      toast({
        description: (
          <div className="flex items-center gap-3">
            <BadgeCheck size={18} className="mr-2 text-green-500" />
            <span>تم تحديث البيانات.</span>
          </div>
        ),
      });
    },
    onError: () => {
      toast({
        description: (
          <div className="flex items-center gap-3">
            <BadgeInfo size={18} className="mr-2 text-red-500" />
            <span>حدث خطأ ما، الرجاء المحاولة مرة اخرى.</span>
          </div>
        ),
      });
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      let updatedMoney = Number(user?.owned_money) + data.owned_money!;
      if (updatedMoney < 0) {
        toast({
          description: (
            <div className="flex items-center gap-3">
              <BadgeInfo size={18} className="mr-2 text-red-500" />
              <span>لا يمكن ان يكون المبلغ المملوك اقل من صفر.</span>
            </div>
          ),
        });

        return;
      }

      await updateUserData(data);
    } catch (error) {
      console.log("update user role:", error);
    }
  }

  useEffect(() => {
    form.reset({
      role: user?.role,
      owned_money: 0,
      password: "",
    });
  }, [isSuccess]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-5 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>تعديل كلمة المرور</FormLabel>
                <Input
                  disabled={isLoading}
                  {...field}
                  type="text"
                  placeholder="أدخل كلمة المرور الجديدة"
                  dir="rtl"
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="owned_money"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اضافة مبلغ مالي</FormLabel>
                <Input
                  disabled={isLoading}
                  {...field}
                  type="number"
                  placeholder="أدخل المبلغ"
                  dir="rtl"
                />

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>صلاحيت المستخدم</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  dir="rtl"
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-5 max-w-[250px] w-full text-lg h-12"
        >
          {isLoading ? "جاري حفظ..." : "حفظ"}
        </Button>
      </form>
    </Form>
  );
}
