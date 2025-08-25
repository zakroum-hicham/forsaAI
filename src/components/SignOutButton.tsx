'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

const SignOutButton = () => {
  return (
          <Button className='w-full justify-start'
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
  );
};

export default SignOutButton;
