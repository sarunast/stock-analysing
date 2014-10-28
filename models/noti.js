module.exports = function(sequelize, DataTypes) {
  var noti = sequelize.define('noti', {
    found: DataTypes.BOOLEAN,
    finished: DataTypes.BOOLEAN,
    browser: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        noti.belongsTo(models.uquery)
      }
    }
  })
 
  return noti
}