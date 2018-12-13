module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define('Delivery', {
    delivery_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING(64),
    phone: DataTypes.STRING(64),
    local: DataTypes.STRING(64),
    domain: DataTypes.STRING(64),
    passwd: DataTypes.STRING(64),

    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  return Delivery;
};
