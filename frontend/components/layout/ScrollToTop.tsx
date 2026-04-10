"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
            const scrollProgress = winHeight > 0 ? (scrollTop / winHeight) * 100 : 0

            setIsVisible(scrollTop > 100)
            setProgress(scrollProgress)
        }

        window.addEventListener("scroll", handleScroll)
        handleScroll()
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        })
    }

    const radius = 18
    const strokeWidth = 2.5
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 99,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(10px)',
                pointerEvents: isVisible ? 'auto' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <button
                onClick={scrollToTop}
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-lg transition-transform hover:scale-110 active:scale-95 group"
                aria-label="Scroll to top"
            >
                {/* Progress Ring */}
                <svg className="absolute h-full w-full -rotate-90 transform">
                    <circle
                        cx="22"
                        cy="22"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-muted/20"
                    />
                    <circle
                        cx="22"
                        cy="22"
                        r={radius}
                        stroke="var(--primary)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        style={{
                            strokeDashoffset: offset,
                            transition: "stroke-dashoffset 0.1s linear"
                        }}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Arrow Icon */}
                <ArrowUp className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-0.5" />
            </button>
        </div>
    )
}
