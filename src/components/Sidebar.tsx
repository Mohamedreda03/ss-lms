"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { admin_menu_data } from "./menu_data";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="lg:block shadow fixed right-0 inset-y-0 w-60 border-l hidden">
      <div>
        <div className="flex items-center justify-center">
          {/* <h2 className="border-b border-secondary w-fit">Teacher</h2> */}
          <Image
            src="/img/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col mt-4">
          {admin_menu_data.map((link) => (
            <Link
              key={link.id}
              href={link.link}
              className={cn(
                "px-4 py-3 flex items-center gap-3 dark:hover:bg-secondary/10 hover:bg-secondary/10",
                {
                  "border-l-4 border-secondary bg-secondary/20 hover:bg-secondary/20":
                    pathname.includes(link.link),
                }
              )}
            >
              <link.Icon size={20} className="text-secondary" />
              <span>{link.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
