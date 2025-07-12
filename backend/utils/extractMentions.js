module.exports = function extractMentions(text) {
    const regex = /@([\w\d_]+)/g;
    const mentions = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        mentions.push(match[1]);
    }

    return mentions;
};
