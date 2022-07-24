const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const GroupTable = sequelize.define('grouptable', {
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey: true,
        autoIncrement:true
    },
    isAdmin:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

module.exports = GroupTable;