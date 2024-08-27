const User = require('../models/user');

exports.multiply = async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    const user = await User.findOne({'apiKeys.key': apiKey});

    if (!user) {
        return res.status(401).json({error: 'Invalid API Key'});
    }

    const {a, b} = req.body;

    if (typeof a !== 'number' || typeof b !== 'number') {
        return res.status(400).json({error: 'Both inputs must be numbers'});
    }

    const result = a * b;
    await User.findByIdAndUpdate(user._id, {
        $push: {logs: {apiKey, endpoint: '/multiply', timestamp: new Date()}}
    });

    res.json({result});
};