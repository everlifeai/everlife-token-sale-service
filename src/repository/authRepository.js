const { User } = require('everlife-token-sale-model');

module.exports.createUser = async function (user) {
    const newUser = new User(user);

    //      understand/
    //  The flag `isPrivateInvestor` (meaning private sale user) was initially to be used for determining when token
    //  should be issued. Since then the decision was taken to handle all users like private sale users. The flag
    //  is left here since it used by the backend services.
    newUser.isPrivateInvestor = true;

    return await newUser.save();
};

module.exports.getUser = async function (email) {
    return User.findOne({ "email": email });
};
