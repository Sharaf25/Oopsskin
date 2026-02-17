const {RefreshToken} = require("../models");
const { Op } = require("sequelize");

/**
 * Deletes expired refresh tokens from DB
 */
async function cleanExpiredTokens() {
  try {
    const now = new Date();
    const deletedCount = await RefreshToken.destroy({
      where: {
        expiresAt: { [Op.lte]: now } // all tokens that have expired
      },
    });
    console.log(`Expired refresh tokens cleaned: ${deletedCount}`);
  } catch (error) {
    console.error("Error cleaning expired tokens:", error.message);
  }
}

module.exports = cleanExpiredTokens;
