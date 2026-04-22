import React from 'react'

// AuthLayout Component
interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, rgba(255,255,255,0.16), transparent 35%), linear-gradient(135deg, #050505 0%, #161616 45%, #050505 100%)",
          filter: 'brightness(0.4)',
        }}
      />

      {/* Border Frame */}
      <div className="absolute inset-4 md:inset-6 lg:inset-8 border-[6px] md:border-[8px] border-white/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-10 py-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
