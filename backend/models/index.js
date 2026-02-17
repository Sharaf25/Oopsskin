const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

// Load all models
db.User = require("./User")(sequelize, Sequelize.DataTypes);
db.Cart = require("./Cart")(sequelize, Sequelize.DataTypes);
db.CartItem = require("./CartItem")(sequelize, Sequelize.DataTypes);
db.Order = require("./Order")(sequelize, Sequelize.DataTypes);
db.OrderItem = require("./OrderItem")(sequelize, Sequelize.DataTypes);
db.RefreshToken = require("./RefreshToken")(sequelize, Sequelize.DataTypes);
db.InvalidToken = require("./InvalidToken")(sequelize, Sequelize.DataTypes);
db.Voucher = require("./Voucher")(sequelize, Sequelize.DataTypes);

// Then run associations
Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
