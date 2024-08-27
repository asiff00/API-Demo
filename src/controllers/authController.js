const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await user.save();
        res.status(201).json({message: 'User created successfully'});
    } catch (error) {
        res.status(500).json({error: 'Error signing up'});
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).json({error: 'Invalid credentials'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET || 'your_jwt_secret', {expiresIn: '1d'});
        res.json({token});
    } catch (error) {
        res.status(500).json({error: 'Error logging in'});
    }
};