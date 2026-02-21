const { Tag } = require("../models");

exports.addTag = async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.editTag = async (req, res) => {
  try {
    await Tag.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTag = async (req, res) => {
  try {
    await Tag.destroy({ where: { id: req.params.id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
