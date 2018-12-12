module.exports = (sequelize, DataTypes) => {
  const Seller = sequelize.define('Seller', {
    seller_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    name: DataTypes.STRING(64),
    phone: DataTypes.STRING(64),
    local: DataTypes.STRING(64),
    domain: DataTypes.STRING(64),
    passwd: DataTypes.STRING(64),
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  Seller.associate = m => m.Seller.hasMany(m.Store, {
    as: 'Store',
    foreignKey: 'seller_id',
  });

  return Seller;
};
