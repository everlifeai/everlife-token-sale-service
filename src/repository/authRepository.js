const { User } = require('../../../everlife-token-sale-model/src/index');

module.exports.createUser = async function (user) {
    const newUser = new User(user);
    return await newUser.save();
};

module.exports.getUser = async function (email) {
    return User.findOne({ "email": email });
};
