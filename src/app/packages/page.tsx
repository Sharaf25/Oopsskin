export default function PackagesPage() {
  const packages = [
    {
      id: 1,
      name: 'Starter Kit',
      description: 'Perfect for beginners - everything you need to start your beauty journey',
      price: 89.99,
      items: ['Foundation', 'Mascara', 'Lipstick', 'Blush', 'Brush Set'],
    },
    {
      id: 2,
      name: 'Complete Face Set',
      description: 'Full face coverage with primer, foundation, concealer, and setting spray',
      price: 149.99,
      items: ['Primer', 'Foundation', 'Concealer', 'Setting Powder', 'Setting Spray'],
    },
    {
      id: 3,
      name: 'Eye Perfection Bundle',
      description: 'Create stunning eye looks with our complete eye collection',
      price: 129.99,
      items: ['Eyeshadow Palette', 'Eyeliner', 'Mascara', 'Eye Primer', 'Eye Brushes'],
    },
    {
      id: 4,
      name: 'Lip Lover\'s Collection',
      description: 'All your favorite lip products in one amazing set',
      price: 79.99,
      items: ['Lipstick Set', 'Lip Gloss', 'Lip Liner', 'Lip Balm'],
    },
    {
      id: 5,
      name: 'Pro Makeup Kit',
      description: 'Professional-grade products for the makeup artist in you',
      price: 299.99,
      items: ['Full Product Range', 'Professional Brushes', 'Carrying Case', 'Tutorial Guide'],
    },
    {
      id: 6,
      name: 'Travel Essentials',
      description: 'Mini versions of your favorites, perfect for on-the-go',
      price: 59.99,
      items: ['Mini Foundation', 'Mini Mascara', 'Mini Lipstick', 'Mini Setting Spray', 'Travel Bag'],
    },
  ];

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-4 uppercase">
            PACKAGES & SETS
          </h1>
          <p className="text-xl text-white mb-6">Curated collections for every beauty need</p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-pink-300 transition-all transform hover:-translate-y-2"
              >
                {/* Package Image Placeholder */}
                <div className="relative h-64 bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                  <div className="text-6xl font-black text-white opacity-20">PACKAGE</div>
                  <div className="absolute top-4 right-4 bg-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                    SAVE 30%
                  </div>
                </div>

                {/* Package Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase">
                    {pkg.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>

                  {/* Items List */}
                  <div className="mb-4">
                    <h4 className="font-bold text-sm text-gray-900 mb-2 uppercase">Includes:</h4>
                    <ul className="space-y-1">
                      {pkg.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <span className="text-pink-500 mr-2">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200">
                    <span className="text-3xl font-black text-gray-900">
                      ${pkg.price}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-full uppercase text-sm transition-all transform hover:scale-105">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-black text-pink-500 text-center mb-12 uppercase">
            WHY BUY PACKAGES?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4">
                30%
              </div>
              <h3 className="text-xl font-bold mb-2">Save More</h3>
              <p className="text-gray-600">Get up to 30% off when buying sets</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4">
                ★
              </div>
              <h3 className="text-xl font-bold mb-2">Curated Collections</h3>
              <p className="text-gray-600">Products that work perfectly together</p>
            </div>
            <div className="text-center">
              <div className="bg-pink-500 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black mx-auto mb-4">
                ♥
              </div>
              <h3 className="text-xl font-bold mb-2">Perfect Gifts</h3>
              <p className="text-gray-600">Ready-to-gift packaging available</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
