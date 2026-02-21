const {
  Category,
  Tag,
  Product,
  ProductImage,
  ProductRating,
  sequelize,
} = require("../models");

const createDummyData = async () => {
  try {
    // ---------- 1️⃣ Categories ----------
    const categories = await Category.bulkCreate(
      [
        { name_en: "Makeup", name_ar: "مكياج" },
        { name_en: "Skincare", name_ar: "العناية بالبشرة" },
        { name_en: "Tools", name_ar: "أدوات" },
        { name_en: "Perfume", name_ar: "عطور" },
        { name_en: "Haircare", name_ar: "العناية بالشعر" },
      ],
      { ignoreDuplicates: true },
    );

    // ---------- 2️⃣ Tags ----------
    const tags = await Tag.bulkCreate(
      [
        { name_en: "Lips", name_ar: "شفاه" },
        { name_en: "Eyes", name_ar: "عيون" },
        { name_en: "Face", name_ar: "وجه" },
        { name_en: "Hair", name_ar: "شعر" },
        { name_en: "Body", name_ar: "الجسم" },
        { name_en: "Nails", name_ar: "أظافر" },
        { name_en: "Organic", name_ar: "عضوي" },
        { name_en: "Luxury", name_ar: "فاخر" },
        { name_en: "Daily", name_ar: "يومي" },
        { name_en: "Hot", name_ar: "شائع" },
      ],
      { ignoreDuplicates: true },
    );

    // ---------- 3️⃣ Products ----------
    const products = await Product.bulkCreate(
      [
        {
          name_en: "Lipstick Red",
          name_ar: "أحمر شفاه أحمر",
          details_en: "Smooth red lipstick for all occasions",
          details_ar: "أحمر شفاه ناعم لجميع المناسبات",
          price: 50,
          before_price: 60,
          stock: 10,
          badge: "new",
          category_id: categories[0].id,
        },
        {
          name_en: "Eyeliner Black",
          name_ar: "كحل أسود",
          details_en: "Long-lasting eyeliner",
          details_ar: "كحل طويل الأمد",
          price: 30,
          stock: 15,
          category_id: categories[0].id,
        },
        {
          name_en: "Face Cream",
          name_ar: "كريم وجه",
          details_en: "Hydrating cream for daily use",
          details_ar: "كريم مرطب للاستخدام اليومي",
          price: 80,
          before_price: 100,
          stock: 20,
          badge: "hot",
          category_id: categories[1].id,
        },
        {
          name_en: "Perfume Classic",
          name_ar: "عطر كلاسيك",
          details_en: "Long-lasting fragrance",
          details_ar: "رائحة تدوم طويلاً",
          price: 120,
          stock: 5,
          badge: "luxury",
          category_id: categories[3].id,
        },
        {
          name_en: "Hair Oil",
          name_ar: "زيت شعر",
          details_en: "Nourishing oil for healthy hair",
          details_ar: "زيت مغذي للشعر الصحي",
          price: 40,
          stock: 25,
          category_id: categories[4].id,
        },
        {
          name_en: "Blush Pink",
          name_ar: "أحمر خدود وردي",
          details_en: "Soft pink blush",
          details_ar: "أحمر خدود وردي ناعم",
          price: 35,
          stock: 12,
          badge: "new",
          category_id: categories[0].id,
        },
        {
          name_en: "Shampoo Daily",
          name_ar: "شامبو يومي",
          details_en: "Gentle shampoo for everyday use",
          details_ar: "شامبو لطيف للاستخدام اليومي",
          price: 25,
          stock: 30,
          category_id: categories[4].id,
        },
        {
          name_en: "Face Mask",
          name_ar: "قناع وجه",
          details_en: "Purifying face mask",
          details_ar: "قناع وجه منظف",
          price: 45,
          stock: 18,
          category_id: categories[1].id,
        },
        {
          name_en: "Lip Gloss",
          name_ar: "لمعان شفاه",
          details_en: "Shiny lip gloss",
          details_ar: "لمعان شفاه لامع",
          price: 20,
          stock: 22,
          category_id: categories[0].id,
        },
        {
          name_en: "Eyelash Curler",
          name_ar: "محدد الرموش",
          details_en: "Professional eyelash curler",
          details_ar: "محدد رموش احترافي",
          price: 60,
          stock: 8,
          category_id: categories[2].id,
        },
      ],
      { ignoreDuplicates: true },
    );

    // ---------- 4️⃣ ProductImages + Tags ----------
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // Add 3 images per product (all same dummy image)
      for (let j = 0; j < 3; j++) {
        await ProductImage.create({
          image_url: "uploads/products/dummy.jpg",
          is_featured: j === 0, // first image is featured
          product_id: product.id,
        });
      }

      // Assign 2 random tags to each product
      const randomTags = tags
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((t) => t.id);

      await product.setTags(randomTags);
    }
    // ---------- 5️⃣ ProductRatings ----------
    // Add random ratings (1-5) for first 5 products
    for (let i = 0; i < 5; i++) {
      const product = products[i];
      await ProductRating.bulkCreate([
        {
          user_id: 1,
          product_id: product.id,
          rating: Math.floor(Math.random() * 5) + 1,
        },
        {
          user_id: 2,
          product_id: product.id,
          rating: Math.floor(Math.random() * 5) + 1,
        },
      ]);
    }

    console.log("✅ Dummy data created successfully!");
  } catch (err) {
    console.error("❌ Error creating dummy data:", err);
  }
};

module.exports = createDummyData;
