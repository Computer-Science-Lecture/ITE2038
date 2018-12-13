module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    payment: DataTypes.STRING(256),
    menus: DataTypes.STRING(512),
    done: {
      type:DataTypes.INTEGER,
      defaultValue: 0,
    },
    delivery_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
    },
  }, {
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
  };

  return Order;
};
