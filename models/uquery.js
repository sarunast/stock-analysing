module.exports = function(sequelize, DataTypes) {
  var uquery = sequelize.define('uquery', {
    query: DataTypes.STRING,
    sort: DataTypes.STRING,
    agg: DataTypes.STRING,
    forever: DataTypes.BOOLEAN,
    endtime: DataTypes.DATE,
    count: DataTypes.INTEGER,
    sessionID: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    completed: DataTypes.BOOLEAN
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
      	uquery.hasMany(models.noti)
        uquery.hasMany(models.notification)
        uquery.hasMany(models.stock)
      }
    }
  })
 
  return uquery
}