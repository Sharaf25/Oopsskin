module.exports = (sequelize, DataTypes) => {
  const InvalidToken = sequelize.define(
    "InvalidToken",
    {
      token: { type: DataTypes.STRING, allowNull: false, unique: true },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
    },
    { tableName: "invalid_tokens", timestamps: true }
  );

  return InvalidToken;
};
