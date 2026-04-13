import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // ✅ Get session on server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ✅ Protect route
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />

      <ScrollArea className="border rounded-2xl flex-1 h-full w-full overflow-hidden">
        <Navbar />
        <div className="p-4">{children}</div>
      </ScrollArea>
    </div>
  );
};

export default Layout;