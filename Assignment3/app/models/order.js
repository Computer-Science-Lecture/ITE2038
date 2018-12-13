module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  Order.associate = m => {
    m.Order.belongsTo(m.Customer, {
      foreignKey: 'customer_id',
    });

    m.Order.belongsTo(m.Store, {
      foreignKey: 'store_id',
    });

    m.Order.belongsTo(m.Destination, {
      foreignKey: 'destination_id',
    });

    m.Order.hasMany(m.Menu, {
      as: 'Menu',
      foreignKey: 'order_id',
    });
  };

  return Order;
};
