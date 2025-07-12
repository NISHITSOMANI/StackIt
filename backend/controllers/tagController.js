const Tag = require("../models/Tag");

exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find({}, { name: 1 });

        const formatted = tags.map(tag => ({
            id: tag._id,
            name: tag.name.charAt(0).toUpperCase() + tag.name.slice(1)
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch tags", error: err.message });
    }
};
