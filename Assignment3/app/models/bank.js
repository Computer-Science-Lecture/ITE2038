module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define('Bank', {
    bank_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    code: DataTypes.INTEGER,
    name: DataTypes.STRING(64),
  }, {
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
  });

  return Bank;
};
