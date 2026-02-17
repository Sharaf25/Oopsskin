module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define(
    "Voucher",
    {
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      type: { type: DataTypes.ENUM("percentage", "fixed"), allowNull: false },
      value: { type: DataTypes.FLOAT, allowNull: false },
      max_usage: { type: DataTypes.INTEGER, allowNull: false },
      used_count: { type: DataTypes.INTEGER, defaultValue: 0 },
      expires_at: { type: DataTypes.DATE, allowNull: true },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { tableName: "vouchers", timestamps: true }
  );

  return Voucher;
};
