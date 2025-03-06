"use client";

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client";
import YearCourses from "./YearCourses";
import { useEffect, useState } from "react";
import { Years_Banks } from "@/utils/years_data";
import { useQuery } from "react-query";
import Loading from "@/components/Loading";
import axios from "axios";

type YearType = "1" | "2" | "3" | "B1" | "B2" | "B3" | null;

export default function FilterCorses() {
  const [currentYear, setCurrentYear] = useState<YearType>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const data = await axios.get("/api/courses").then((res) => res.data.data);
      setFilteredCourses(data as Course[]);
      return data;
    },
  });

  const filterCourses = (year: YearType) => {
    if (year === null) {
      setFilteredCourses(data as Course[]);
      setCurrentYear(year);
      return;
    }
    setCurrentYear(year);
    setFilteredCourses(data?.filter((course: any) => course.year === year)!);
  };

  useEffect(() => {
    filterCourses(null);
  }, [data]);

  if (isLoading) {
    return <Loading className="h-[300px]" />;
  }

  return (
    <div>
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center justify-center flex-wrap gap-3 border p-2 rounded-lg border-secondary/50">
          <Button
            variant={currentYear === null ? "secondary" : "outline"}
            onClick={() => filterCourses(null)}
          >
            الكل
          </Button>
          {Years_Banks.map((year) => (
            <Button
              key={year.year}
              variant={currentYear === year.year ? "secondary" : "outline"}
              onClick={() => filterCourses(year.year as YearType)}
            >
              {year.name}
            </Button>
          ))}
        </div>
      </div>
      {filteredCourses.length === 0 && (
        <div className="flex items-center justify-center h-52">
          <p className="text-2xl">لا يوجد دورات</p>
        </div>
      )}
      <YearCourses courses={filteredCourses} />
    </div>
  );
}
