export default function SkincarePage() {
  const skincareProducts = [
    { name: 'Cleansers', icon: '🧼', color: 'from-blue-400 to-blue-500' },
    { name: 'Toners', icon: '💧', color: 'from-cyan-400 to-cyan-500' },
    { name: 'Serums', icon: '✨', color: 'from-purple-400 to-purple-500' },
    { name: 'Moisturizers', icon: '🌸', color: 'from-pink-400 to-pink-500' },
    { name: 'Masks', icon: '🎭', color: 'from-green-400 to-green-500' },
    { name: 'Eye Care', icon: '👁️', color: 'from-indigo-400 to-indigo-500' },
    { name: 'Sunscreen', icon: '☀️', color: 'from-yellow-400 to-orange-500' },
    { name: 'Night Care', icon: '🌙', color: 'from-purple-600 to-indigo-700' },
  ];

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase">
            SKINCARE
          </h1>
          <p className="text-2xl text-white mb-6">Healthy skin is beautiful skin</p>
          <button className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full uppercase text-sm transition-all transform hover:scale-105">
            SHOP SKINCARE
          </button>
        </div>
      </section>

      {/* Skincare Routine Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-4 uppercase">
            YOUR SKINCARE ROUTINE
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Build the perfect skincare routine with our expertly curated products
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {skincareProducts.map((product) => (
              <div
                key={product.name}
                className={`bg-gradient-to-br ${product.color} rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform h-48 text-center`}
              >
                <div className="text-5xl mb-3">{product.icon}</div>
                <h3 className="text-xl font-black text-white uppercase">
                  {product.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
            WHY OOPSSKIN SKINCARE?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold mb-3">Natural Ingredients</h3>
              <p className="text-gray-600">
                Formulated with the finest natural and organic ingredients for gentle, effective care
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">🔬</div>
              <h3 className="text-2xl font-bold mb-3">Scientifically Proven</h3>
              <p className="text-gray-600">
                Backed by dermatological research and clinical testing for visible results
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-6xl mb-4">🐰</div>
              <h3 className="text-2xl font-bold mb-3">Cruelty Free</h3>
              <p className="text-gray-600">
                Never tested on animals - beauty with a conscience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
            BESTSELLING SKINCARE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-pink-300 transition-all"
              >
                <div className="h-80 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                  <div className="w-40 h-40 bg-white rounded-full"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Hydrating Serum</h3>
                  <p className="text-gray-600 mb-4">Deep hydration for all skin types</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black">$49.99</span>
                    <div className="flex text-pink-500">★★★★★</div>
                  </div>
                  <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-full uppercase text-sm transition-all">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
