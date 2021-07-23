module.exports = (sequelize, Sequelize) => {
    const Chat = sequelize.define("chat", {
        room_id: {
            type: Sequelize.STRING
        },
        user_email: {
            type: Sequelize.STRING
        },
        user_name: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.JSON
        },
        dis_reason: {
            type: Sequelize.STRING
        }
    });
    return Chat;
};