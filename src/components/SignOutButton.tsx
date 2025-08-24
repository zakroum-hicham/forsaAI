'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

const SignOutButton = () => {
  return (
    <div className="px-4 pb-4">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-gray-50 hover:text-red-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
  );
};

export default SignOutButton;
