const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    apiKeys: [{
        key: String,
        createdAt: Date
    }],
    logs: [{
        apiKey: String,
        endpoint: String,
        timestamp: Date
    }]
});

module.exports = mongoose.model('User', userSchema);