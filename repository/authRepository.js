const User = require('./../models/user');

module.exports.createUser = async function (user) {
    const newUser = new User(user);
    return await newUser.save();
}

module.exports.getUser = async function (email) {
    const user = await User.findOne(
        {
            "email": email
        }
    );
    return user;
}
