"use client";

import FilterCorses from "@/components/admin_dashboard/courses/FilterCorses";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  return (
    <div className="p-5">
      <div className="mb-10 mt-5">
        <Button variant="secondary" className="text-lg">
          <Link href="/admin/courses/new" className="flex items-center">
            <PlusCircle size={18} className="ml-2 text-white" />
            <span>اضافة دورة جديدة</span>
          </Link>
        </Button>
      </div>
      <FilterCorses />
    </div>
  );
}
