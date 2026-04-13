"use client";

import {
    BarbellIcon,
    HouseIcon,
    MapPinIcon,
    SignOutIcon,
    SparkleIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import Image from "next/image";

const navItems = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: HouseIcon,
    },
    {
        name: "Fitness Planner",
        href: "/fitness-planner",
        icon: BarbellIcon,
    },
    {
        name: "AI Coach",
        href: "/ai-coach",
        icon: SparkleIcon,
    },
    {
        name: "Find Gym",
        href: "/find-gym",
        icon: MapPinIcon,
    },
];

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showProfile, setShowProfile] = useState(false);

    // 🔥 Replace with your auth user data
    const { data: session } = authClient.useSession();

    const user = session?.user;
    const handleLogout = async () => {
        setIsLoading(true);
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                },
            },
        });
        setIsLoading(false);
    };

    return (
        <aside className="flex flex-col justify-between h-full p-4 bg-sidebar border rounded-2xl shadow-md">

            {/* 🔝 Top Navigation */}
            <div className="flex flex-col items-center gap-6">
                {navItems.map((item) => {
                    const isActive = pathname.includes(item.href);
                    const Icon = item.icon;

                    return (
                        <div key={item.href} className="relative group">
                            <Link
                                href={item.href}
                                className={`p-3 rounded-xl transition flex items-center justify-center
                ${isActive
                                        ? "bg-primary text-white shadow"
                                        : "hover:bg-gray-200 text-gray-700"
                                    }`}
                            >
                                <Icon size={26} weight="duotone" />
                            </Link>

                            {/* Tooltip */}
                            <span
                                className="absolute z-20 left-14 top-1/2 -translate-y-1/2 
                whitespace-nowrap px-3 py-1 text-sm rounded-md 
                bg-black text-white opacity-0 group-hover:opacity-100 
                transition pointer-events-none"
                            >
                                {item.name}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* 🔻 Bottom Section */}
            <div className="flex flex-col items-center gap-4 relative">
                <ModeToggle />

                {/* 👤 Profile Avatar */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile((prev) => !prev)}
                        className="rounded-full overflow-hidden border-2 border-primary"
                    >
                        <Image
                            src={user?.image as string || "https://i.pravatar.cc/300"}
                            alt="profile"
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </button>

                    {/* Profile Dropdown */}
                    {showProfile && (
                        <div className="z-20 absolute bottom-0 left-18 w-56 bg-secondary border rounded-xl shadow-lg p-4">
                            <div className="mb-3">
                                <p className="font-medium text-sm">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>

                            <Button
                                onClick={handleLogout}
                                disabled={isLoading}
                                variant="destructive"
                                className="w-full flex items-center gap-2"
                            >
                                <SignOutIcon size={18} />
                                {isLoading ? "Logging out..." : "Logout"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;