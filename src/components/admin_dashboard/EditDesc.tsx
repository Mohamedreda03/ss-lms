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
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  description: z.string().min(2, {
    message: "يجب أن يحتوي العنوان على 2 حرف على الأقل",
  }),
});

import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Textarea } from "../ui/textarea";
import { toast } from "@/hooks/use-toast";
import { BadgeCheck, BadgeInfo } from "lucide-react";
import { useMutation, useQueryClient } from "react-query";
import QuillEditor from "../QuillEditor";

export default function EditDesc({
  desc,
  courseId,
}: {
  desc: string;
  courseId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: desc,
    },
  });

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (data: z.infer<typeof FormSchema>) => {
      await axios.patch(`/api/courses/${courseId}`, {
        description: data.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("courses");
      toast({
        description: (
          <div className="flex items-center gap-3">
            <BadgeCheck size={18} className="mr-2 text-green-500" />
            <span>تم تعديل الوصف بنجاح</span>
          </div>
        ),
      });
      setIsEditing(false);
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
    await mutateAsync(data);
  }

  return (
    <div className="border dark:border-secondary/30 border-secondary/50 w-full rounded-md p-5">
      <div className="flex flex-col">
        <p className="text-gray-500 mb-3">الوصف</p>
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {/* <Textarea {...field} disabled={isLoading} /> */}

                      <QuillEditor
                        value={field.value}
                        onChange={(value) =>
                          form.setValue("description", value)
                        }
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" variant="secondary" disabled={isLoading}>
                حفظ
              </Button>
              <Button
                variant="outline"
                className="mr-3"
                disabled={isLoading}
                onClick={() => setIsEditing(false)}
              >
                الغاء
              </Button>
            </form>
          </Form>
        ) : (
          <div className="flex items-center justify-between">
            {/* <h1 className="text-xl font-semibold">{desc}</h1> */}
            <div
              className="html-content"
              dangerouslySetInnerHTML={{
                __html: desc || "",
              }}
            />
            <Button onClick={() => setIsEditing(true)} variant="secondary">
              تعديل
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
