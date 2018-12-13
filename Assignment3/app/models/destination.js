module.exports = (sequelize, DataTypes) => {
  const Destination = sequelize.define('Destination', {
    destination_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
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
