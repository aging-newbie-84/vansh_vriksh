import React from 'react';

const MandalaBorder = ({ children, className = "" }) => {
  return (
    <div className={`relative min-h-screen p-6 md:p-10 ${className}`}>
      {/* Decorative SVG Border Container */}
      <div className="pointer-events-none fixed inset-0 z-50">
        {/* Repeating Mandala Motif Borders */}
        <div className="absolute inset-0 border-[24px] md:border-[40px] border-transparent"
             style={{
               borderImageSource: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z' fill='%23D4AF37'/%3E%3C/svg%3E")`,
               borderImageSlice: '30%',
               borderImageRepeat: 'repeat',
               opacity: 0.4
             }}
        />
        
        {/* Corner Accents (Simplified for now) */}
        <div className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 opacity-60">
           <svg viewBox="0 0 100 100" fill="var(--color-accent)">
             <path d="M0 0 L100 0 L50 50 L0 100 Z" opacity="0.2"/>
             <circle cx="20" cy="20" r="10"/>
           </svg>
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 rotate-90 opacity-60">
           <svg viewBox="0 0 100 100" fill="var(--color-accent)">
             <path d="M0 0 L100 0 L50 50 L0 100 Z" opacity="0.2"/>
             <circle cx="20" cy="20" r="10"/>
           </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 -rotate-90 opacity-60">
           <svg viewBox="0 0 100 100" fill="var(--color-accent)">
             <path d="M0 0 L100 0 L50 50 L0 100 Z" opacity="0.2"/>
             <circle cx="20" cy="20" r="10"/>
           </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 rotate-180 opacity-60">
           <svg viewBox="0 0 100 100" fill="var(--color-accent)">
             <path d="M0 0 L100 0 L50 50 L0 100 Z" opacity="0.2"/>
             <circle cx="20" cy="20" r="10"/>
           </svg>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default MandalaBorder;
