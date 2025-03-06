"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { Download, LoaderCircle } from "lucide-react";

const CreateCouponsSchema = z.object({
  couponType: z.enum(["course", "amount"]),
  value: z.coerce.number().optional(),
  numberOfCoupons: z.coerce.number().min(1),
  courseId: z.string().optional(),
});

const CreateCoupons = () => {
  const queryClient = useQueryClient();
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const form = useForm<z.infer<typeof CreateCouponsSchema>>({
    resolver: zodResolver(CreateCouponsSchema),
    defaultValues: {
      couponType: "amount",
    },
  });

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (data: z.infer<typeof CreateCouponsSchema>) => {
      data.value = await courses.find(
        (course: any) => course.id === data.courseId
      ).price;
      const response = await axios.post("/api/coupons", data, {
        responseType: "blob",
      });

      // إنشاء رابط لتنزيل الملف
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadLink(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
    },
  });

  const { data: courses } = useQuery({
    queryFn: async () => {
      const res = await axios.get("/api/coupons/courses");

      return res.data;
    },
  });

  async function onSubmit(data: z.infer<typeof CreateCouponsSchema>) {
    await mutateAsync(data);
  }

  return (
    <div className="h-[60vh] flex flex-col gap-5 items-center justify-center">
      <div className="flex items-center justify-center">
        <h2 className="text-3xl dark:text-white text-first-100 border-b-2 border-first pb-2">
          انشاء كوبون
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[300px] w-full space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="couponType"
              render={({ field }) => (
                <FormItem>
                  <Select
                    dir="rtl"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue="amount" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="amount">قيمة مالية</SelectItem>
                      <SelectItem value="course">كورس</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("couponType") === "amount" && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="قيمة الكوبون"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch("couponType") === "course" && (
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <Select dir="rtl" onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="أختر الكورس" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses?.map((course: any) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="numberOfCoupons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد الكوبونات</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="العدد"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "جاري الانشاء" : "انشاء"}
            {isLoading && (
              <LoaderCircle size={18} className="animate-spin mr-2" />
            )}
          </Button>
        </form>
      </Form>
      {downloadLink && (
        <a
          href={downloadLink}
          download={`coupons-${Date.now()}.txt`}
          className="mt-4 bg-first px-5 py-2 text-white rounded-lg flex items-center gap-2"
        >
          <span>Download Coupons</span>
          <Download size={18} />
        </a>
      )}
    </div>
  );
};

export default CreateCoupons;
