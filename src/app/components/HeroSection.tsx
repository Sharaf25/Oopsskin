'use client';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-black via-pink-200 to-black min-h-[600px] flex items-center justify-center overflow-hidden mt-16">
      {/* Background Video or Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-pink-200" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <h1 className="text-6xl md:text-7xl font-black text-black mb-4 uppercase">
            WE PRESSED<br />RESET
          </h1>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105">
            SHOP NOW
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black rounded-full -mb-32 -ml-32" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-black rounded-full -mt-32 -mr-32" />
    </section>
  );
}
