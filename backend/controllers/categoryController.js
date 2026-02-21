const { Category, Product } = require("../models");

exports.addCategory = async (req, res) => {
  try {
    const { name_en, name_ar } = req.body;
    const category = await Category.create({ name_en, name_ar });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    await category.update(req.body);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { category_id: req.params.id },
    });

    for (let p of products) {
      p.category_id = null;
      await p.save();
    }

    await Category.destroy({ where: { id: req.params.id } });

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// GET ALL CATEGORIES (PUBLIC)
// ==============================
exports.getAllCategories = async (req, res) => {
  try {
    const lang = req.query.lang === "ar" ? "ar" : "en";

    const categories = await Category.findAll({
      attributes: ["id", `name_${lang}`],
      order: [[`name_${lang}`, "ASC"]],
    });

    const data = categories.map((c) => ({
      id: c.id,
      name: c[`name_${lang}`],
    }));

    res.json({ totalItems: categories.length, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
