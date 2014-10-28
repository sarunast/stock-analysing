module.exports = function(sequelize, DataTypes) {
  var notification = sequelize.define('notification', {
    finished: DataTypes.BOOLEAN,
    session: DataTypes.STRING
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
      	notification.belongsTo(models.uquery)
        notification.belongsTo(models.noti)
      }
    }
  })
 
  return notification
}