"use client";

import { Book, LayoutDashboard, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import OwnedMoney from "./OwnedMoney";

export default function AuthMenu({ session }: { session: any }) {
  const avatar = session?.user.name.slice(0, 2).toLocaleUpperCase();

  const handleSignOut = async () => {
    await signOut({
      redirectTo: "/",
    });
  };

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="p-0 rounded-full">
          <Avatar>
            <AvatarFallback>{avatar}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>حسابي</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center justify-center md:hidden">
            <OwnedMoney />
          </DropdownMenuItem>

          {session && session.user.role === "ADMIN" && (
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard">
                <LayoutDashboard className="ml-2 h-4 w-4" />
                <span>لوحت التحكم</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="ml-2 h-4 w-4" />
              <span>ملف المستخدم</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/student_courses">
              <Book className="ml-2 h-4 w-4" />
              <span>كورساتي</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="ml-2 h-4 w-4" />
          <span>تسجيل الخروج</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
