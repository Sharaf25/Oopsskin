const axios = require("axios");
const qs = require("qs");
const cache = require("../utils/cache");

const DEFAULT_IMAGE = "https://www.stylecraze.com/wp-content/uploads/2021/01/15-Best-Honey-Skin-Care-Products-For-Beautiful-Skin-Banner.jpg";

const fetchProducts = async () => {
  const cached = cache.get("products");
  if (cached) return cached;

  try {
    const postData = qs.stringify({
      token: "Vmc2QUhQak9WOGFoOGtmNXp5cEo4L3g4MHBmZE5uSGdKbk9LcnU0ZDdOWUZhRytna1BaTmxRSThEUEhLTWd3aTRUVk9acXlKK0hOWGQvKzFMbzJnRVNQOFBLZ2piWTZPakpUNEd2RVFqdVE9",
      action: "download",
      type: "products",
      all: 0,
      view_items_by: 0
    });

    const response = await axios.post(
      "https://test.hesabate.com/store_api.php",
      postData,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const data = (response.data && response.data.table) ? response.data.table : [];

    const transformed = data
      .map(product => {
        const measureColors = product.measure ? product.measure.map(m => m.color_id) : [];
        const price = (product.product_prices && product.product_prices[0]) ? product.product_prices[0].pprice : null;
        return {
          id: product.id,
          name: product.name,
          item_img: product.item_img || DEFAULT_IMAGE,
          price,
          color_id_main: product.color_id,
          color_id_measure: measureColors
        };
      })
      // ✅ Skip any products with price 0 or null
      .filter(p => p.price && p.price > 0);

    cache.set("products", transformed); // cache 30 min
    return transformed;

  } catch (err) {
    console.error("Error fetching products:", err);
    return [];
  }
};


// Controller for Express route
const getProducts = async (req, res) => {
  try {
    let products = await fetchProducts();

    // --- Price filter ---
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);

    if (!isNaN(minPrice)) {
      products = products.filter(p => p.price !== null && p.price >= minPrice);
    }
    if (!isNaN(maxPrice)) {
      products = products.filter(p => p.price !== null && p.price <= maxPrice);
    }

    // --- Sorting ---
    const sort = req.query.sort; // 'asc' or 'desc'
    if (sort === 'asc') {
      products.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === 'desc') {
      products.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    // --- Pagination only if page or limit is provided ---
    const hasPagination = req.query.page || req.query.limit;
    let paginatedProducts = products;

    let page = 1;
    let limit = products.length; // default: return all

    if (hasPagination) {
      page = parseInt(req.query.page) || 1;
      limit = parseInt(req.query.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      paginatedProducts = products.slice(startIndex, endIndex);
    }

    res.json({
      totalItems: products.length,
      page,
      limit,
      totalPages: hasPagination ? Math.ceil(products.length / limit) : 1,
      data: paginatedProducts
    });

  } catch (err) {
    console.error("Route error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Optional: auto-refresh every 30 min
setInterval(async () => {
  console.log("Auto-refreshing products cache...");
  try {
    await fetchProducts();
    console.log("Products cache refreshed.");
  } catch (err) {
    console.error("Error refreshing cache:", err);
  }
}, 30 * 60 * 1000);

module.exports = { fetchProducts, getProducts };
