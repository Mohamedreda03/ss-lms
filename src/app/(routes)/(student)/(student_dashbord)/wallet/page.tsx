"use client";

import CenterCodeInput from "@/components/CenterCodeInput";
import PaymentsTable from "@/components/PaymentsTable";
import WalletInput from "@/components/WalletInput";
import axios from "axios";
import { useQuery } from "react-query";

// export const dynamic = "force-dynamic";
export default function WalletPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["userPayments"],
    queryFn: async () => {
      return await axios.get("/api/payment").then((res) => res.data);
    },
  });

  return (
    <div>
      <div>
        <WalletInput session={data?.session} />
      </div>
      <div className="mt-4 border-t pt-4">
        <CenterCodeInput />
      </div>
      <div className="mt-14">
        <div className="text-center text-2xl mb-5">
          <h3>الطلبات السابقة</h3>
        </div>
        <PaymentsTable payments={data?.payments!} isLoading={isLoading} />
      </div>
    </div>
  );
}
