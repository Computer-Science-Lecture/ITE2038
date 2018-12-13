module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    customer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING(64),
    phone: DataTypes.STRING(64),
    local: DataTypes.STRING(64),
    domain: DataTypes.STRING(64),
    passwd: DataTypes.STRING(64),
    lat: DataTypes.STRING(64),
    lng: DataTypes.STRING(64),
    payments: DataTypes.JSON,
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  Customer.associate = m => {
    m.Customer.hasMany(m.Order, {
      as: 'Order',
      foreignKey: 'customer_id',
    });
    m.Customer.hasMany(m.Destination, {
      as: 'Destination',
      foreignKey: 'customer_id',
    });
  };

  return Customer;
};
