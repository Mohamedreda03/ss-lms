import {
  Book,
  User2,
  LucideIcon,
  Wallet,
  BookMinus,
  Home,
  Barcode,
  QrCode,
  History,
  FlaskConical,
} from "lucide-react";

interface MenuData {
  id: number;
  title: string;
  Icon: LucideIcon;
  link: string;
}

export const menu_data: MenuData[] = [
  {
    id: 1,
    title: "ملف المستخدم",
    Icon: User2,
    link: "/profile",
  },
  {
    id: 2,
    title: "محفظتي",
    Icon: Wallet,
    link: "/wallet",
  },
  {
    id: 3,
    title: "كورساتي",
    Icon: Book,
    link: "/student_courses",
  },
];

export const admin_menu_data: MenuData[] = [
  {
    id: 1,
    title: "الرئيسية",
    link: "/admin/dashboard",
    Icon: Home,
  },
  {
    id: 2,
    title: "الكورسات",
    link: "/admin/courses",
    Icon: BookMinus,
  },
  {
    id: 3,
    title: "المستخدمين",
    link: "/admin/users",
    Icon: User2,
  },
  {
    id: 4,
    title: "الامتحانات و الواجبات",
    link: "/admin/tests_and_sheets",
    Icon: FlaskConical,
  },
  {
    id: 5,
    title: "الكوبونات",
    link: "/admin/coupons",
    Icon: QrCode,
  },
  {
    id: 6,
    title: "بيانات العمليات",
    link: "/admin/history",
    Icon: History,
  },
];
