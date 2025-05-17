"use client";

import { UserNav } from "@/components/navbar/user-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { useUser } from "reactfire";
import { UserIcon } from "lucide-react";

export const NavbarUserLinks: FC = () => {
  const { data, hasEmitted } = useUser();

  return (
    <>
      {hasEmitted && data ? (
        <Link 
          href="/app" 
          className="flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 shadow-md transition-all hover:shadow-lg">
          <UserIcon className="h-4 w-4 mr-2" />
          <span className="font-medium">Account</span>
        </Link>
      ) : (
        <Link 
          href="/login" 
          className="flex items-center px-4 py-2 rounded-md bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all">
          <UserIcon className="h-4 w-4 mr-2" />
          <span className="font-medium">Login</span>
          <span className="ml-1 text-xs bg-teal-400 text-teal-900 py-0.5 px-1.5 rounded-full font-bold">→</span>
        </Link>
      )}
    </>
  );
};
