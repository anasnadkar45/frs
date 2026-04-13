import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  return session.user;
}

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <h1 className="text-2xl font-bold">My Profile</h1>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>

          <CardContent className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={user.image || "/default-avatar.png"}
                alt="profile"
                width={80}
                height={80}
                className="rounded-full border"
              />
            </div>

            {/* Info */}
            <div className="space-y-1">
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>

          <CardContent className="flex gap-4">
            <form action="/api/logout" method="POST">
              <Button variant="destructive">
                Logout
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}