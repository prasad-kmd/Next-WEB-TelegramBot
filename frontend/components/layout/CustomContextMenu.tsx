"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  RotateCw,
  ArrowLeft,
  ArrowRight,
  Copy,
  ExternalLink,
  Home,
  Info,
  Link as LinkIcon,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const MenuItem = ({ icon: Icon, label, onClick, disabled }: MenuItemProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!disabled) onClick();
    }}
    disabled={disabled}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-2 text-sm transition-colors duration-200",
      disabled
        ? "text-muted-foreground cursor-not-allowed"
        : "text-foreground hover:bg-primary/10 hover:text-primary"
    )}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

export const CustomContextMenu = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetLink, setTargetLink] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();

    // Find if the click was on a link
    const target = e.target as HTMLElement;
    const linkElement = target.closest('a');
    if (linkElement && linkElement.href) {
      setTargetLink(linkElement.href);
    } else {
      setTargetLink(null);
    }

    setPosition({ x: e.clientX, y: e.clientY });
    setVisible(true);
  }, []);

  const handleClick = useCallback(() => {
    setVisible(false);
    setTargetLink(null);
  }, []);

  useEffect(() => {
    // Disable on small screens, but allow on desktops with touch (e.g. laptops)
    if (window.innerWidth < 1024) return;

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleClick);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleClick);
    };
  }, [handleContextMenu, handleClick]);

  useEffect(() => {
    if (visible && menuRef.current) {
      const menu = menuRef.current;
      const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
      const { offsetWidth: menuWidth, offsetHeight: menuHeight } = menu;

      let x = position.x;
      let y = position.y;

      if (x + menuWidth > windowWidth) x = windowWidth - menuWidth - 10;
      if (y + menuHeight > windowHeight) y = windowHeight - menuHeight - 10;

      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
    }
  }, [visible, position]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[10000] min-w-[220px] bg-card/90 backdrop-blur-md border border-border rounded-lg shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200"
      style={{ left: position.x, top: position.y }}
    >
      {targetLink && (
        <>
          <MenuItem
            icon={ExternalLink}
            label="Open in New Tab"
            onClick={() => {
              window.open(targetLink, '_blank', 'noopener,noreferrer');
              setVisible(false);
            }}
          />
          <MenuItem
            icon={LinkIcon}
            label="Copy Link Address"
            onClick={() => {
              navigator.clipboard.writeText(targetLink);
              toast.success("Link address copied");
              setVisible(false);
            }}
          />
          <div className="my-1 border-t border-border" />
        </>
      )}

      <MenuItem
        icon={ArrowLeft}
        label="Back"
        onClick={() => window.history.back()}
      />
      <MenuItem
        icon={ArrowRight}
        label="Forward"
        onClick={() => window.history.forward()}
      />
      <MenuItem
        icon={RotateCw}
        label="Reload"
        onClick={() => window.location.reload()}
      />

      <div className="my-1 border-t border-border" />

      <MenuItem
        icon={Home}
        label="Go to Home"
        onClick={() => window.location.href = '/'}
      />
      <MenuItem
        icon={Copy}
        label="Copy Page URL"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Page URL copied to clipboard");
          setVisible(false);
        }}
      />

      <div className="my-1 border-t border-border" />

      <MenuItem
        icon={Info}
        label="About Site"
        onClick={() => window.location.href = '/about'}
      />
      <MenuItem
        icon={Mail}
        label="Contact Developer"
        onClick={() => window.location.href = '/contact'}
      />
    </div>
  );
};
