const crypto = require('crypto');
const User = require('../models/user');

exports.createApiKey = async (req, res) => {
    try {
        const apiKey = crypto.randomBytes(32).toString('hex');
        await User.findByIdAndUpdate(req.userId, {
            $push: {apiKeys: {key: apiKey, createdAt: new Date()}}
        });
        res.json({apiKey});
    } catch (error) {
        res.status(500).json({error: 'Error creating API key'});
    }
};

exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({
            apiKeys: user.apiKeys,
            logs: user.logs
        });
    } catch (error) {
        res.status(500).json({error: 'Error fetching user data'});
    }
};