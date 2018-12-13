module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    store_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    sname: DataTypes.STRING(64),
    address: DataTypes.STRING(64),
    phone_nums: DataTypes.JSON,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    schedules: DataTypes.JSON,

    description: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: "[]",
    },
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  Store.associate = m => {
    m.Store.belongsTo(m.Seller, {
      foreignKey: 'seller_id',
    });

    m.Store.hasMany(m.Order, {
      as: 'Order',
      foreignKey: 'store_id', 
    });

    m.Store.hasMany(m.Menu, {
      as: 'Menu',
      foreignKey: 'store_id'
    })
  };

  return Store;
};
