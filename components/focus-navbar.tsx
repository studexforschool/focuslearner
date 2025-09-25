"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Brain, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import toast from "react-hot-toast";

export function FocusNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
    },
    {
      name: "Focus Session",
      link: "/focus",
    },
    {
      name: "Tasks",
      link: "/tasks",
    },
    {
      name: "Analytics",
      link: "/analytics",
    },
    {
      name: "AI Assistant",
      link: "/ai-assistant",
    },
    {
      name: "Settings",
      link: "/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const handleNavClick = (link: string) => {
    router.push(link);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-white dark:text-white light:text-black" />
            <span className="text-xl font-bold text-white dark:text-white light:text-black">
              FocusLearner
            </span>
          </div>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.link)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.link
                    ? "bg-white/20 dark:bg-white/20 light:bg-black/20 text-white dark:text-white light:text-black"
                    : "text-light-gray dark:text-light-gray light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white dark:text-white light:text-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white dark:text-white light:text-black">
                  {user?.name}
                </p>
              </div>
            </div>
            <AnimatedThemeToggler />
            <NavbarButton 
              variant="secondary" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-white dark:text-white light:text-black" />
              <span className="text-xl font-bold text-white dark:text-white light:text-black">
                FocusLearner
              </span>
            </div>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {/* User Info */}
            <div className="flex items-center space-x-3 p-4 border-b border-white/10 dark:border-white/10 light:border-black/10">
              <div className="w-10 h-10 bg-white/10 dark:bg-white/10 light:bg-black/10 rounded-full flex items-center justify-center">
                <span className="text-base font-medium text-white dark:text-white light:text-black">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white dark:text-white light:text-black">
                  {user?.name}
                </p>
                <p className="text-xs text-light-gray dark:text-light-gray light:text-gray-600">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Navigation Items */}
            {navItems.map((item, idx) => (
              <button
                key={`mobile-link-${idx}`}
                onClick={() => handleNavClick(item.link)}
                className={`w-full text-left p-4 transition-colors ${
                  pathname === item.link
                    ? "bg-white/20 dark:bg-white/20 light:bg-black/20 text-white dark:text-white light:text-black"
                    : "text-light-gray dark:text-light-gray light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-black hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-black/5"
                }`}
              >
                <span className="block font-medium">{item.name}</span>
              </button>
            ))}

            {/* Mobile Actions */}
            <div className="flex w-full flex-col gap-4 p-4 border-t border-white/10 dark:border-white/10 light:border-black/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-light-gray dark:text-light-gray light:text-gray-600">
                  Theme
                </span>
                <AnimatedThemeToggler />
              </div>
              <NavbarButton
                onClick={handleLogout}
                variant="secondary"
                className="w-full flex items-center justify-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
