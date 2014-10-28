module.exports = function(sequelize, DataTypes) {
  var stock = sequelize.define('stock', {
    time: DataTypes.DATE,
    tradeprice: DataTypes.FLOAT,
    tradesize: DataTypes.INTEGER,
    buyer: DataTypes.STRING,
    seller: DataTypes.STRING,
    symbol: DataTypes.STRING,
    currency: DataTypes.STRING,
    bid: DataTypes.FLOAT,
    ask: DataTypes.FLOAT,
    open: DataTypes.FLOAT,
    prevclose: DataTypes.FLOAT
  },{
    timestamps: false,
      classMethods: {
      associate: function(models) {
        stock.belongsTo(models.uquery)
      }
    }
  })
 
  return stock
}
