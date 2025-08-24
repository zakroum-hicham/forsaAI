"use client";

import Link from "next/link";
import { Briefcase, ChevronsUpDown, HelpCircle, LayoutDashboard, MessageSquare, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
interface SidebarProps {
  isSidebarOpen: boolean;
  user: {
    name: string;
    email: string;
    initials: string;
  };
}

export default function Sidebar({
  isSidebarOpen,
  user,
}: SidebarProps) {
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Briefcase, label: "Jobs" },
  ];

  const bottomItems = [
    { icon: HelpCircle, label: "Support" },
    { icon: MessageSquare, label: "Feedback" },
  ];

  return (
    <div
      className={`${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-64 bg-gray-100 border-r border-gray-200 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <Link href="/dashboard">
          <div className="p-4 border-b border-gray-200">
            <div className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                </div>
              </div>
              <div>
                <h1 className="text-m font-semibold text-gray-900">xmap</h1>
                <p className="text-sm text-gray-500">Standard</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4 px-3">
            Platform
          </p>
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                href={`/${item.label.toLowerCase()}`}
                key={index}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="px-4 pb-4 space-y-1">
          {bottomItems.map((item, index) => (
            <Link
              key={index}
              href={`/${item.label.toLowerCase()}`}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* User Info */}
        <div className="px-4 pb-6 border-t border-gray-200 pt-4">
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user.initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Log Out Button */}
        <div className="px-4 pb-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-gray-50 hover:text-red-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
