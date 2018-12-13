module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('Menu', {
    menu_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: DataTypes.STRING(64),
    price: DataTypes.INTEGER,
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  Menu.associate = m => {
    m.Menu.belongsTo(m.Store, {
      foreignKey: 'store_id',
    });
  };

  return Menu;
};
