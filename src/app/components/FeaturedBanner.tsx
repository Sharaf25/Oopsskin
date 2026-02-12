'use client';

export function FeaturedBanner() {
  return (
    <section className="py-16 bg-gradient-to-b from-pink-50 to-white relative overflow-hidden">
      {/* Decorative Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-400 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
            }}
          >
            ★
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-6 uppercase">
              HABIBTI<br />KITS
            </h2>
            <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105">
              SHOP NOW
            </button>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pink-300 aspect-square rounded-lg" />
                <div className="bg-pink-400 aspect-square rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
