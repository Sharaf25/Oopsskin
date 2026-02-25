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
        // Additional products to reach 30
        {
          name_en: "Body Lotion",
          name_ar: "لوشن للجسم",
          details_en: "Hydrating body lotion",
          details_ar: "لوشن مرطب للجسم",
          price: 55,
          stock: 20,
          category_id: categories[1].id,
        },
        {
          name_en: "Nail Polish Red",
          name_ar: "طلاء أظافر أحمر",
          details_en: "Bright red nail polish",
          details_ar: "طلاء أظافر أحمر لامع",
          price: 15,
          stock: 40,
          category_id: categories[0].id,
        },
        {
          name_en: "Hair Brush",
          name_ar: "فرشاة شعر",
          details_en: "Detangling hair brush",
          details_ar: "فرشاة لفك تشابك الشعر",
          price: 30,
          stock: 15,
          category_id: categories[2].id,
        },
        {
          name_en: "Eyeshadow Palette",
          name_ar: "لوحة ظلال العيون",
          details_en: "Colorful eyeshadow palette",
          details_ar: "لوحة ظلال عيون ملونة",
          price: 70,
          stock: 10,
          category_id: categories[0].id,
        },
        {
          name_en: "Hand Cream",
          name_ar: "كريم اليدين",
          details_en: "Soft hand cream",
          details_ar: "كريم لليدين ناعم",
          price: 25,
          stock: 30,
          category_id: categories[1].id,
        },
        {
          name_en: "Perfume Rose",
          name_ar: "عطر ورد",
          details_en: "Floral fragrance",
          details_ar: "رائحة زهرية",
          price: 110,
          stock: 7,
          category_id: categories[3].id,
        },
        {
          name_en: "Hair Serum",
          name_ar: "سيروم شعر",
          details_en: "Shiny hair serum",
          details_ar: "سيروم لشعر لامع",
          price: 50,
          stock: 20,
          category_id: categories[4].id,
        },
        {
          name_en: "Bronzer",
          name_ar: "برونزر",
          details_en: "Natural glow bronzer",
          details_ar: "برونزر لإطلالة طبيعية",
          price: 45,
          stock: 12,
          category_id: categories[0].id,
        },
        {
          name_en: "Facial Toner",
          name_ar: "تونر وجه",
          details_en: "Refreshing facial toner",
          details_ar: "تونر منعش للوجه",
          price: 35,
          stock: 18,
          category_id: categories[1].id,
        },
        {
          name_en: "Makeup Sponge",
          name_ar: "اسفنجة مكياج",
          details_en: "Blending makeup sponge",
          details_ar: "اسفنجة لدمج المكياج",
          price: 15,
          stock: 50,
          category_id: categories[2].id,
        },
        {
          name_en: "Perfume Vanilla",
          name_ar: "عطر فانيليا",
          details_en: "Sweet vanilla fragrance",
          details_ar: "رائحة فانيليا حلوة",
          price: 130,
          stock: 6,
          category_id: categories[3].id,
        },
        {
          name_en: "Conditioner Daily",
          name_ar: "بلسم يومي",
          details_en: "Daily hair conditioner",
          details_ar: "بلسم يومي للشعر",
          price: 30,
          stock: 25,
          category_id: categories[4].id,
        },
        {
          name_en: "Lip Balm",
          name_ar: "مرهم شفاه",
          details_en: "Moisturizing lip balm",
          details_ar: "مرهم مرطب للشفاه",
          price: 10,
          stock: 60,
          category_id: categories[0].id,
        },
        {
          name_en: "Face Serum",
          name_ar: "سيروم وجه",
          details_en: "Anti-aging face serum",
          details_ar: "سيروم مضاد للشيخوخة",
          price: 90,
          stock: 15,
          category_id: categories[1].id,
        },
        {
          name_en: "Nail File",
          name_ar: "مبرد أظافر",
          details_en: "Smooth nail file",
          details_ar: "مبرد أظافر ناعم",
          price: 8,
          stock: 50,
          category_id: categories[2].id,
        },
        {
          name_en: "Hair Mask",
          name_ar: "قناع شعر",
          details_en: "Deep conditioning hair mask",
          details_ar: "قناع لتغذية الشعر بعمق",
          price: 55,
          stock: 12,
          category_id: categories[4].id,
        },
        {
          name_en: "Blush Coral",
          name_ar: "أحمر خدود كورال",
          details_en: "Coral blush for healthy glow",
          details_ar: "أحمر خدود كورال لإطلالة صحية",
          price: 40,
          stock: 15,
          category_id: categories[0].id,
        },
        {
          name_en: "Shampoo Oil Control",
          name_ar: "شامبو تحكم في الزيوت",
          details_en: "Shampoo for oily hair",
          details_ar: "شامبو للتحكم في الشعر الدهني",
          price: 28,
          stock: 20,
          category_id: categories[4].id,
        },
      ],
      { ignoreDuplicates: true },
    );

    // ---------- 4️⃣ ProductImages + Tags ----------
    const imageOptions = [
      "uploads/products/dummy.jpg",
      "uploads/products/dummy2.jpg",
    ];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // Add 3 images per product (randomized)
      for (let j = 0; j < 3; j++) {
        const randomImage =
          imageOptions[Math.floor(Math.random() * imageOptions.length)];
        await ProductImage.create({
          image_url: randomImage,
          is_featured: j === 0,
          product_id: product.id,
        });
      }

      // Assign 2 random tags
      const randomTags = tags
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((t) => t.id);

      await product.setTags(randomTags);
    }

    // ---------- 5️⃣ ProductRatings ----------
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

    console.log("✅ Dummy data for 30 products created successfully!");
  } catch (err) {
    console.error("❌ Error creating dummy data:", err);
  }
};

module.exports = createDummyData;
