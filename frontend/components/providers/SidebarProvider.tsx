"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface SidebarContextType {
    isCollapsed: boolean
    toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    // Initialize state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sidebar-collapsed")
        if (saved !== null) {
            const timer = requestAnimationFrame(() => {
                setIsCollapsed(saved === "true")
            });
            return () => cancelAnimationFrame(timer);
        }
    }, [])

    // Update localStorage and CSS variable when state changes
    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", String(isCollapsed))

        // Set CSS variable for dynamic layout adjustments
        const width = isCollapsed ? "80px" : "256px"
        document.documentElement.style.setProperty("--sidebar-width", width)
    }, [isCollapsed])

    const toggleSidebar = () => setIsCollapsed((prev) => !prev)

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}
