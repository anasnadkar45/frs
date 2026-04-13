"use client"
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { SignOutIcon } from '@phosphor-icons/react';

const Navbar = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
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
        <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-foreground">Fitness</h1>
                <div className="flex items-center gap-3">
                    {user && (
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-foreground">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.image as string} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                    <Button
                        onClick={handleLogout}
                        disabled={isLoading}
                        variant="destructive"
                        className="w-fit flex items-center gap-2"
                    >
                        <SignOutIcon weight='duotone' size={18} />
                        {isLoading ? "Logging out..." : "Logout"}
                    </Button>
                </div>
            </div>
        </header>
    )
}

export default Navbar