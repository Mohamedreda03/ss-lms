import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminHeader />
      <Sidebar />
      <div className="lg:pr-60">{children}</div>
    </div>
  );
}
