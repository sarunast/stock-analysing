module.exports = function(sequelize, DataTypes) {
  var tempstock = sequelize.define('tempstock', {
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
      }
    }
  })
 
  return tempstock
}
