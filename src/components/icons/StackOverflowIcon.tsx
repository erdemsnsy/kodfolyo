import React from 'react';

export function StackOverflowIcon({ className = 'w-4 h-4', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M17.36 20.2v-5.38h1.79V22H2.83v-7.18h1.79v5.38h12.74z" />
      <path d="M6.77 14.32l.37-1.76 8.79 1.85-.37 1.76-8.79-1.85zm1.16-4.21l.76-1.63 8.14 3.78-.76 1.63-8.14-3.78zm2.25-4.02l1.15-1.38 6.9 5.75-1.15 1.38-6.9-5.75zM15.34 0l7.2 9.59-1.43 1.08-7.2-9.59L15.34 0zM6.59 17.9h9v1.8h-9v-1.8z" />
    </svg>
  );
}
