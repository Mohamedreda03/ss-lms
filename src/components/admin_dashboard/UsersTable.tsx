"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Years } from "@/utils/years_data";

import { User } from "@prisma/client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "react-query";
import Link from "next/link";
import Loading from "../Loading";
import Pagenation from "../Pagenation";

const filterUsers = ["online", "center"];
const filterGrades = ["1", "2", "3"];

export default function UsersTable() {
  const pageSize = 15;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [searchName, setSearchName] = useState<string>("");
  const [searchPhone, setSearchPhone] = useState<string>("");
  const [searchBtn, setSearchBtn] = useState<string>("1");
  const [filter, setFilter] = useState<"online" | "center" | undefined>(
    undefined
  );
  const [grade, setGrade] = useState<"1" | "2" | "3" | undefined>(undefined);

  const [isLoadingExcel, setIsLoadingExcel] = useState(false);

  const { data, isLoading: dataLoading } = useQuery({
    queryKey: ["users", currentPage, searchBtn, filter, grade],
    queryFn: async () => {
      const res = await axios.get(
        `/api/users/search?name=${searchName}&phone=${searchPhone}&page=${currentPage}&pageSize=${pageSize}&filter=${filter}&grade=${grade}`
      );

      setCurrentPage(res.data.meta.currentPage);
      setSearchTotalPages(res.data.meta.totalPages);

      return res.data;
    },
  });

  const downloadExcel = async () => {
    setIsLoadingExcel(true);
    const response = await fetch("/api/users/search/download_data", {
      method: "GET",
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    setIsLoadingExcel(false);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchBtn(Math.random().toString());
  };

  return (
    <div>
      <div>
        <form
          onSubmit={handleSearch}
          className="mb-4 flex items-center flex-col sm:flex-row gap-3"
        >
          <Input
            placeholder="بحث بأسم المستخدم"
            className="max-w-[300px]"
            onChange={(e) => setSearchName(e.target.value)}
            disabled={dataLoading}
          />

          <Input
            placeholder="بحث برقم الهاتف"
            className="max-w-[300px]"
            onChange={(e) => setSearchPhone(e.target.value)}
            disabled={dataLoading}
          />

          <div>
            <Button
              disabled={dataLoading}
              variant="secondary"
              className="mt-auto"
            >
              <span>بحث</span>
              <Search size={15} className="mr-1.5" />
            </Button>
          </div>
        </form>
      </div>
      <div className="flex items-center justify-center flex-col lg:flex-row gap-4 mb-8">
        <div className="flex items-center justify-center gap-3 border p-2 rounded-lg border-secondary/50">
          <Button
            variant={filter === undefined ? "secondary" : "outline"}
            onClick={() => setFilter(undefined)}
          >
            الكل
          </Button>
          {filterUsers.map((type) => (
            <Button
              key={type}
              variant={filter === type ? "secondary" : "outline"}
              onClick={() => setFilter(type as "online" | "center")}
            >
              {type === "online" ? "أونلاين" : "سنتر"}
            </Button>
          ))}
        </div>
        <div className="flex items-center flex-wrap justify-center gap-3 border p-2 rounded-lg border-secondary/50">
          <Button
            variant={grade === undefined ? "secondary" : "outline"}
            onClick={() => setGrade(undefined)}
          >
            الكل
          </Button>
          {filterGrades.map((year) => (
            <Button
              key={year}
              variant={grade === year ? "secondary" : "outline"}
              onClick={() => setGrade(year as any)}
            >
              {year === "1" && "الصف الاول الثاني"}
              {year === "2" && "الصف الثاني الثانوي"}
              {year === "3" && "الصف الثالث الثانوي"}
            </Button>
          ))}
        </div>
      </div>
      {/* <Button
        variant="outline"
        onClick={downloadExcel}
        disabled={isLoadingExcel}
        className="flex items-center mb-2"
      >
        <span>تحميل ملف اكسل</span>
        <Download size={15} className="mr-1.5" />
      </Button> */}
      {dataLoading ? (
        <Loading className="h-[300px]" />
      ) : (
        <Table dir="rtl" className="mb-8 border">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">أسم المستخدم</TableHead>
              <TableHead className="text-center">رقم الهاتف</TableHead>
              <TableHead className="text-center">المحافظة</TableHead>
              <TableHead className="text-center">الصف</TableHead>
              <TableHead className="text-center"></TableHead>
            </TableRow>
          </TableHeader>
          {data?.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-lg">
                لا يوجد بيانات
              </TableCell>
            </TableRow>
          )}
          <TableBody>
            {data &&
              data?.data.map((user: User) => (
                <TableRow key={user?.id}>
                  <TableCell className="font-medium text-center">
                    {user?.full_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.student_phone}
                  </TableCell>
                  <TableCell className="text-center">
                    {user?.governorate}
                  </TableCell>
                  <TableCell className="text-center">
                    {Years.find((year) => user?.grade === year.year)?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="secondary" asChild>
                      <Link href={`/admin/users/${user?.id}`}>التفاصيل</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}

      {searchTotalPages > 1 && (
        <Pagenation
          currentPage={currentPage}
          searchTotalPages={searchTotalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
