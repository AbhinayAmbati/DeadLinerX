'use client';

export function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/10" />
      <div
        className="absolute left-1/3 top-1/4 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20 blur-3xl"
        style={{ width: '50rem', height: '50rem' }}
      />
      <div
        className="absolute right-1/3 bottom-1/4 translate-x-1/2 translate-y-1/2 transform rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 opacity-20 blur-3xl"
        style={{ width: '50rem', height: '50rem' }}
      />
    </div>
  );
} 