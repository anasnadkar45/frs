import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

const layout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <div className="flex h-screen gap-4 p-4">
            <Sidebar />

            <ScrollArea className="border rounded-2xl flex-1 h-full w-full overflow-hidden">
                <Navbar />
                <div>
                {children}
                </div>
            </ScrollArea>
        </div>
    )
}

export default layout