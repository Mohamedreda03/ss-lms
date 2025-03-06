"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import DeleteAlert from "../DeleteAlert";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function YearCourses({ courses }: { courses: Course[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <Loading className="h-96" />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 h-full">
      {courses &&
        courses?.map((course) => (
          <div
            key={course?.id}
            className="border border-secondary/40 p-5 rounded-md"
          >
            {course?.image ? (
              <div className="relative w-full h-[270px]">
                <Image
                  src={course?.image}
                  fill
                  alt="course image"
                  className="rounded-md mb-3 object-cover"
                />
              </div>
            ) : (
              <div className="h-[270px] bg-gray-200 rounded-md mb-3" />
            )}
            <div>
              <h1 className="text-xl font-semibold mt-3 border-b-2 border-secondary w-fit mb-2">
                {course?.title}
              </h1>
            </div>

            <div
              className="html-content"
              dangerouslySetInnerHTML={{
                __html: course?.description || "",
              }}
            />
            <div className="mt-4 border-t pt-2 flex flex-wrap items-center gap-3">
              <Link href={`/admin/courses/${course?.id}`}>
                <Button variant="secondary">تعديل الكورس</Button>
              </Link>
              <Link href={`/admin/courses/${course?.id}/sub`}>
                <Button variant="secondary">بيانات المشتركين</Button>
              </Link>
              <DeleteAlert
                buttonTitle="مسح الكورس"
                dialogTitle="هل انت متأكد من حذف الكورس!"
                dialogDescription="سيتم حذف جميع بيانات الكورس نهائيا"
                apiEndpoint={`/api/courses/${course?.id}`}
                toastMessage="تم حذف الكورس بنجاح"
                redirect="/admin/courses"
                queryKey="courses"
              />
            </div>
          </div>
        ))}
    </div>
  );
}
