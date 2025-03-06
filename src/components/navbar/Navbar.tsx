import Link from "next/link";
import Image from "next/image";

import ThemeSwitcher from "../theme-switcher";
import MobileMenu from "./MobileMenu";
import AuthMenu from "../AuthMenu";
import OwnedMoney from "../OwnedMoney";
import { useQuery } from "react-query";
import axios from "axios";
import { auth } from "@/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 left-0 right-0 border-b border-secondary/25 z-50 bg-[url(/img/nav.png)] bg-no-repeat bg-cover rounded-bl-xl rounded-br-xl">
      <div className="relative flex">
        <div className="max-w-screen-2xl mx-auto px-7 h-[100px] flex items-center w-full">
          <nav className="flex items-center justify-between py-4 w-full relative">
            {!session && (
              <>
                <div className="md:flex items-center gap-3 md:gap-5 hidden text-sm w-full">
                  <Link
                    href="/sign-up"
                    className="bg-fourth hover:bg-first-100 w-fit transition-all text-white rounded-full px-3 md:px-5 py-2"
                  >
                    انشاء حساب الان!
                  </Link>

                  <Link
                    href="/sign-in"
                    className="bg-white transition-all w-fit text-first hover:bg-first-100 hover:text-white rounded-full px-3 md:px-5 py-2"
                  >
                    تسجيل الدخول
                  </Link>
                </div>
                <MobileMenu />
              </>
            )}

            <Link
              href="/"
              // className="flex items-center justify-center absolute md:right-[44%] md:left-[44%] lg:right-[45%] lg:left-[45%] xl:right-[46%] xl:left-[46%] right-[35%] left-[35%] bg-white rounded-b-full pt-5 pb-3 border-b-4 border-first border-x"
              className="flex items-center justify-center overflow-hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-b-full pt-5 pb-3 border-b-4 border-first border-x"
            >
              <Image
                src="/img/pp2.png"
                width={100}
                height={100}
                className="mt-7"
                alt="logo"
              />
            </Link>

            <div className="flex items-center gap-5 justify-between w-full">
              <div>
                {session && (
                  <div className="flex items-center gap-4">
                    <AuthMenu session={session} />
                    <div className="hidden md:block">
                      <OwnedMoney />
                    </div>
                  </div>
                )}
              </div>
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
