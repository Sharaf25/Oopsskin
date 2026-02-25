'use client';

import Link from 'next/link';

export function CommunitySection() {
  const skinCareProducts = [
    {
      id: 1,
      name: 'Hydrating Face Serum',
      description: 'Deep hydration with Hyaluronic Acid',
      price: '$45.00',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=600&fit=crop',
      benefits: ['Hydrates', 'Brightens', 'Smooths'],
      color: 'from-blue-400 to-blue-600',
    },
    {
      id: 2,
      name: 'Vitamin C Glow Cream',
      description: 'Brightening moisturizer with Vitamin C',
      price: '$52.00',
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&h=600&fit=crop',
      benefits: ['Anti-aging', 'Radiance', 'Even tone'],
      color: 'from-orange-400 to-orange-600',
    },
    {
      id: 3,
      name: 'Night Recovery Mask',
      description: 'Overnight repair and rejuvenation',
      price: '$38.00',
      image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500&h=600&fit=crop',
      benefits: ['Repairs', 'Nourishes', 'Restores'],
      color: 'from-purple-400 to-purple-600',
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-pink-50/30 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-pink-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-52 h-52 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-pink-500 mb-4 uppercase">
            SKIN CARE
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our luxurious skincare collection designed to nourish, hydrate, and rejuvenate your skin
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {skinCareProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
              }}
            >
              {/* Product Card */}
              <div className="relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Product Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/500x600?text=Skincare';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>

                  {/* Quick View Badge */}
                  <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                      Quick View
                    </span>
                  </div>

                  {/* Benefits Pills */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    {product.benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="bg-white/90 backdrop-blur-sm text-pink-600 text-xs font-bold px-3 py-1 rounded-full shadow-md"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 bg-white">
                  {/* Product Name */}
                  <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-pink-500 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-pink-500">
                      {product.price}
                    </span>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-full uppercase text-xs transition-all transform hover:scale-110 shadow-lg hover:shadow-xl">
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none group-hover:animate-shine"></div>
              </div>

              {/* Floating Shadow */}
              <div className="absolute -bottom-2 left-4 right-4 h-4 bg-pink-200 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link href="/skincare">
            <button className="group bg-pink-500 hover:bg-pink-600 text-white font-black py-4 px-12 rounded-full uppercase text-sm transition-all transform hover:scale-110 shadow-xl hover:shadow-2xl flex items-center gap-3 mx-auto">
              View All Skincare Products
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .group:hover .group-hover\:animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
