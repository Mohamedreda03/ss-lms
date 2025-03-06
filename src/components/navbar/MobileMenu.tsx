"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

import "./nav.css";
import Link from "next/link";
import ThemeSwitcher from "../theme-switcher";
import { LogIn, User2 } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef: any = useRef(null);
  const menuBtn: any = useRef(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: any) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      menuBtn.current &&
      !menuBtn.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex items-center">
      {/* <ThemeSwitcher className="md:hidden" /> */}
      <svg
        ref={menuBtn}
        className={cn("ham hamRotate ham8 block md:hidden w-16 h-16", {
          active: isOpen,
        })}
        viewBox="0 0 100 100"
        width="60"
        onClick={handleClick}
      >
        <path
          className="line top stroke-white dark:stroke-white"
          d="m 30,33 h 40 c 3.722839,0 7.5,3.126468 7.5,8.578427 0,5.451959 -2.727029,8.421573 -7.5,8.421573 h -20"
        />
        <path
          className="line middle dark:stroke-white stroke-white"
          d="m 30,50 h 40"
        />
        <path
          className="line bottom dark:stroke-white stroke-white"
          d="m 70,67 h -40 c 0,0 -7.5,-0.802118 -7.5,-8.365747 0,-7.563629 7.5,-8.634253 7.5,-8.634253 h 20"
        />
      </svg>

      <nav
        ref={menuRef}
        className="absolute top-[80px] w-full left-0 right-0 md:hidden bg-first/90 text-white rounded-lg z-50"
      >
        <ul
          className={cn(
            "hidden flex-col gap-4 w-full h-0 overflow-hidden transition-all duration-300 p-5",
            {
              "h-[160px] flex": isOpen,
            }
          )}
        >
          <li className="w-full">
            <Link
              onClick={handleClick}
              href="/sign-up"
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-lg bg-first w-full h-full border border-first-200"
            >
              <User2 size={23} className="text-white" />
              انشئ حساب الان!
            </Link>
          </li>
          <li className="w-full">
            <Link
              onClick={handleClick}
              href="/sign-in"
              className="flex items-center gap-2 px-5 py-3 rounded-lg text-lg bg-first w-full h-full border border-first-200"
            >
              <LogIn size={23} className="text-white" />
              سجل الدخول الي حسابك
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
