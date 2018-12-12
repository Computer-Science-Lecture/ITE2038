module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    delivery_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: DataTypes.STRING(64),
    phone: DataTypes.STRING(64),
    local: DataTypes.STRING(64),
    domain: DataTypes.STRING(64),
    passwd: DataTypes.STRING(64),

    lat: DataTypes.STRING(64),
    lng: DataTypes.STRING(64),
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  Delivery.associate = m => m.Delivery.hasMany(m.Order, {
    as: 'Order',
    foreignKey: 'delivery_id',
  });

  return Delivery;
};
