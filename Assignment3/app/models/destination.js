module.exports = (sequelize, DataTypes) => {
  const Destination = sequelize.define('Destination', {
    Destination_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    lat: DataTypes.STRING(64),
    lng: DataTypes.STRING(64),
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  Destination.associate = m => m.Destination.belongsTo(m.Customer, {
    foreignKey: 'customer_id',
  });

  return Destination;
};
