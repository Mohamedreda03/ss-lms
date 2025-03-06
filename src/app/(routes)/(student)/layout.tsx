import { auth } from "@/auth";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
