const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_image: {
        type: DataTypes.STRING,
        allowNull: false
      },
    product_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_detail: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    product_price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    product_category: {
        type: DataTypes.STRING,
        allowNull: false
    },
  }, {
    tableName: 'products',
    timestamps: false,
    freezeTableName: true
  });

  return Product;
};
