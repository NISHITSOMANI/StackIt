const Tag = require("../models/Tag");

exports.getAllTags = async (req, res) => {
    try {
        const { tags } = req.query;

        let query = {};

        // If specific tags are requested, filter by them
        if (tags) {
            const tagNames = tags.split(",").map(tag => tag.trim().toLowerCase());
            query.name = { $in: tagNames };
        }

        const tagDocs = await Tag.find(query, { name: 1 });

        const formatted = tagDocs.map(tag => ({
            id: tag._id,
            name: tag.name.charAt(0).toUpperCase() + tag.name.slice(1)
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch tags", error: err.message });
    }
};
