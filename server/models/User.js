const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user_contact: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_pass: {
      type: DataTypes.STRING,
      allowNull: false
    }
}, {
    tableName: 'user_accounts',
    timestamps: false,
    freezeTableName: true
  });

  return User;
};
