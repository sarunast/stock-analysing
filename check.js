var db = require('./models');

process.on('message', function (m) {
    if (m === 'handle') {
        db.uquery.findAll({ where: {completed: 0}, include: [ db.noti ] }).success(function (data) {
            data.forEach(function (entry) {
                if (entry.endtime === null || entry.endtime > new Date()) {
                    /*if(!entry.forever || entry.notis.length>0){*/ //OR askes for notifications on found
                    db.sequelize.query('SELECT ' + entry.id + ' AS uqueryId,time,tradeprice,tradesize,buyer,seller,symbol,currency,bid,ask,open,prevclose FROM tempstocks WHERE ' + entry.query).success(function (rows) {
                        if (rows.length > 0) {
                            entry.count = entry.count + rows.length;
                            entry.notis.forEach(function (idata) {
                                if (idata.finished == 1 && entry.forever == 0 && entry.endtime === null) {
                                    if (idata.browser !== null) {
                                        db.notification.find({where: {notiId: idata.id}}).success(function (oldnotidata) {
                                            if (oldnotidata === null) {
                                                db.notification.create({finished: 1, session: idata.browser, uqueryId: entry.id, notiId: idata.id}).success(function (newnotidata) {
                                                    process.send(['updateNoti', newnotidata, entry]);
                                                });
                                            } else {
                                                oldnotidata.finished = 1;
                                                oldnotidata.save().success(function () {
                                                    process.send(['updateNoti', oldnotidata, entry]);
                                                });
                                            }
                                        });

                                    }
                                    if (idata.email !== null) {
                                        process.send(['sendEmail',idata]);
                                    }
                                } else if (idata.found == 1) {
                                    if (idata.browser !== null) {
                                        //process.send(['found',idata,entry]);
                                        db.notification.find({where: {notiId: idata.id}}).success(function (oldnotidata) {
                                            if (oldnotidata === null) {
                                                db.notification.create({finished: 0, session: idata.browser, uqueryId: entry.id, notiId: idata.id}).success(function (newnotidata) {
                                                    process.send(['updateNoti', newnotidata, entry]);
                                                });
                                            } else {
                                                oldnotidata.save().success(function () {
                                                    process.send(['updateNoti', oldnotidata, entry]);
                                                });
                                            }
                                        });
                                    }
                                    if (idata.email !== null) {
                                        process.send(['sendEmail',idata]);
                                    }
                                }
                            });

                            if (entry.forever == 0 && entry.endtime === null) {
                                entry.completed = 1;
                                process.send(['move', entry]);
                            } else {
                                process.send(['update', entry]);
                            }
                            db.stock.bulkCreate(rows);
                            entry.save().success(function () {
                            });
                        }
                    });
                    /*} else {
                     db.sequelize.query('INSERT INTO stocks (query_id,time,tradeprice,tradesize,buyer,seller,symbol,currency,bid,ask,open,prevclose) SELECT '+entry.id+' AS query_id,time,tradeprice,tradesize,buyer,seller,symbol,currency,bid,ask,open,prevclose FROM tempstocks WHERE '+entry.query);
                     }*/
                } else {
                    entry.notis.forEach(function (idata) {
                        if (idata.finished == 1) {
                            if (idata.browser !== null) {
                                db.notification.find({where: {notiId: idata.id}}).success(function (oldnotidata) {
                                    if (oldnotidata === null) {
                                        db.notification.create({finished: 1, session: idata.browser, uqueryId: entry.id, notiId: idata.id}).success(function (newnotidata) {
                                            process.send(['updateNoti', newnotidata, entry]);
                                        });
                                    } else {
                                        oldnotidata.finished = 1;
                                        oldnotidata.save().success(function () {
                                            process.send(['updateNoti', oldnotidata, entry]);
                                        });
                                    }
                                });
                            }
                            if (idata.email !== null) {
                                process.send(['sendEmail',idata]);
                            }
                        }
                    });
                    entry.completed = 1;
                    process.send(['move', entry]);
                    entry.save().success(function () {
                    });
                }
            });
            db.tempstock.destroy().success(function () {
                process.send('done');
            });

        });

    }
});
