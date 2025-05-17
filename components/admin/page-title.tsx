"use client";

import React from "react";
import { ReactNode } from "react";

interface PageTitleProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const PageTitle = ({
  title,
  description,
  icon,
  actions,
}: PageTitleProps) => {
  return (
    <div className="mb-6">
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 shadow-lg overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-400"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blue-300"></div>
          <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-blue-500"></div>
        </div>
        
        <div className="relative flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {icon && (
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg text-white shadow-md border border-white/20">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="text-blue-100/80 text-sm truncate max-w-lg">{description}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-3">{actions}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageTitle; 