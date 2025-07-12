const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Configure axios defaults
const aiClient = axios.create({
    baseURL: AI_SERVICE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Predict tags for a question using AI service
 */
exports.predictTags = async (title, description) => {
    try {
        const response = await aiClient.post('/api/predict-tags/', {
            title,
            description
        });
        return response.data.predicted_tags || [];
    } catch (error) {
        console.error('AI tag prediction error:', error.message);
        // Return basic tags based on common patterns if AI service fails
        const basicTags = [];
        if (title.toLowerCase().includes('react')) basicTags.push('react');
        if (title.toLowerCase().includes('javascript')) basicTags.push('javascript');
        if (title.toLowerCase().includes('python')) basicTags.push('python');
        if (title.toLowerCase().includes('node')) basicTags.push('nodejs');
        return basicTags.length > 0 ? basicTags : ['general'];
    }
};

/**
 * Filter content for profanity and low effort using AI service
 */
exports.filterContent = async (content) => {
    try {
        const response = await aiClient.post('/api/filter-content/', {
            content
        });
        return {
            is_clean: response.data.is_clean,
            filtered_content: response.data.filtered_content || content
        };
    } catch (error) {
        console.error('AI content filtering error:', error.message);
        // Basic content validation as fallback
        const basicProfanity = ['badword1', 'badword2']; // Add actual profanity list
        const hasProfanity = basicProfanity.some(word => 
            content.toLowerCase().includes(word.toLowerCase())
        );
        const isTooShort = content.trim().length < 10;
        
        return { 
            is_clean: !hasProfanity && !isTooShort, 
            filtered_content: content 
        };
    }
};

/**
 * Rank answers using AI service
 */
exports.rankAnswers = async (question, answers) => {
    try {
        const response = await aiClient.post('/api/rank-answers/', {
            question,
            answers
        });
        return response.data.ranked_answers || [];
    } catch (error) {
        console.error('AI answer ranking error:', error.message);
        return answers.map((answer, index) => ({
            index,
            score: 0.5,
            answer
        }));
    }
};

/**
 * Clean answers using AI service
 */
exports.cleanAnswers = async (answers) => {
    try {
        const response = await aiClient.post('/api/clean-answers/', {
            answers
        });
        return response.data.cleaned_answers || answers;
    } catch (error) {
        console.error('AI answer cleaning error:', error.message);
        return answers;
    }
};

/**
 * Health check for AI service
 */
exports.healthCheck = async () => {
    try {
        const response = await aiClient.get('/api/health/');
        return response.status === 200;
    } catch (error) {
        console.error('AI service health check failed:', error.message);
        return false;
    }
}; 