import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { Youtube } from "lucide-react";

export default async function Hero() {
  const session = await auth();
  return (
    <div>
      <div className="max-w-screen-2xl mx-auto px-5 py-10">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/img/bunner2.png"
            width={1400}
            height={600}
            alt="bg"
            className="hero_animation"
          />
          {!session && (
            <div className="flex items-center justify-center w-full relative">
              <div className="flex items-center justify-center w-full">
                <div className="flex items-center justify-center gap-3 md:gap-5 w-full mt-8 text-center">
                  <Link
                    href="/sign-in"
                    className="bg-first w-fit hover:bg-first-100 transition-all text-white rounded-full px-3 md:px-5 py-2 sm:text-lg md:text-2xl lg:text-3xl"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-fourth hover:bg-first-100 w-fit transition-all text-white rounded-full px-3 md:px-5 py-2 sm:text-lg md:text-2xl lg:text-3xl"
                  >
                    انشاء حساب الان!
                  </Link>
                </div>
              </div>
            </div>
          )}
          <div>
            <Button
              asChild
              className="md:text-lg bg-blue-400 hover:bg-blue-300 text-white h-[50px] rounded-full mt-8"
            >
              <a
                href="https://t.me/elqema1/4"
                target="_blank"
                className="flex items-center gap-3"
              >
                <span>مشاهدة فيديو توضيحي للمنصة</span>
                <Image
                  src="/icons/telegram.svg"
                  width={40}
                  height={40}
                  alt="telegram video"
                />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
