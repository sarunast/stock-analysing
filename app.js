/**
 * Module dependencies.
 */
var express = require('express');
var app = express();
var routes = require('./routes');
var http = require('http').createServer(app);
var path = require('path');
var db = require('./models');
var io = require('socket.io').listen(http);
var parser = require('./parser.js');
var mailer = require('express-mailer');
var connection = false;

mailer.extend(app, {
    from: 'notification@stocks.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: '',
        pass: ''
    }
});
// all environments
app.set('port', process.env.PORT || 90);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat'}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./views'));


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/running', routes.running);
app.get('/continuous', routes.continuous);
app.get('/finished', routes.finished);
app.get('/notification', routes.notification);
app.get('/data/:id', routes.datalist);
app.get('/data/:id/result', routes.result);
app.get('/data/:id/element', routes.element);
app.get('/data/:id/:element/:elementId/:what', routes.data);


db
    .sequelize
    .sync(/*{ force: true }*/)
    .complete(function (err) {
        if (err) {
            throw err
        } else {
            db.notification.destroy();
            db.noti.destroy({ email : null});
            db.tempstock.destroy();
            http.listen(app.get('port'), function () {
                console.log('Express server listening on port ' + app.get('port'));
                var server = require('child_process').fork('server.js');
                server.send('start');
                server.on('message', function (m) {

                    if (m[0] === 'update' && m[1].forever == true) {
                        io.sockets.emit('updateForever', m[1]);
                    } else if (m[0] === 'update' && m[1].forever == false) {
                        io.sockets.emit('updateRunning', m[1]);
                    } else if (m[0] === 'move') {
                        io.sockets.emit('moveToFinished', m[1]);
                    } else if (m[0] === 'updateNoti') {
                        m[1]['query'] = m[2];
                        io.sockets.in(m[1].session).emit('updateNoti', m[1]);
                    } else if (m[0] === 'connection') {
                        connection = m[1];
                        io.sockets.emit('connection', m[1]);
                    } else if (m[0] === 'sendEmail'){
                        app.mailer.send('email', {
                            to: m[1].email, // REQUIRED. This can be a comma delimited string just like a normal email to field.
                            subject: 'New Data Found', // REQUIRED.
                            data: m[1] // All additional properties are also passed to the template as local variables.
                        }, function (err) {
                            if (err) {
                                // handle error
                                console.log(err);
                            }
                        });
                    }
                });
                io.sockets.on('connection', function (socket) {
                    cookie = socket.handshake.headers.cookie.match(/^connect\.sid=s%3A([0-9A-Za-z]+)\./)[1];
                    socket.join(cookie);
                    socket.emit('cookie', cookie);
                    socket.emit('connection',connection);
                    socket.on('deleteRunning', function (data) {
                        db.uquery.destroy({id: data.id});
                        db.noti.destroy({uqueryId: data.id});
                        db.stock.destroy({uqueryId: data.id});
                        db.notification.destroy({uqueryId: data.id});
                        socket.broadcast.emit('deleteRunning', data);
                    });
                    socket.on('deleteContinuous', function (data) {
                        db.uquery.destroy({id: data.id});
                        db.noti.destroy({uqueryId: data.id});
                        db.stock.destroy({uqueryId: data.id});
                        db.notification.destroy({uqueryId: data.id});
                        socket.broadcast.emit('deleteContinuous', data);
                    });
                    socket.on('deleteNotification', function (data) {
                        db.notification.destroy({id: data.id});
                        socket.broadcast.emit('deleteNotification', data);
                    });
                    socket.on('deleteFinished', function (data) {
                        db.uquery.destroy({id: data.id});
                        db.noti.destroy({uqueryId: data.id});
                        db.stock.destroy({uqueryId: data.id});
                        db.notification.destroy({uqueryId: data.id});
                        socket.broadcast.emit('deleteFinished', data);
                    });
                    socket.on('query', function (data) {
                        parser.querydis(io, data);
                    });
                    socket.on('sub', function (data) {
                        if ((data.browser !== undefined || data.email !== undefined) && (data.found !== undefined || data.finished !== undefined)) {
                            var noti = {uqueryId: data.id}
                            if (data.browser !== undefined) {
                                noti['browser'] = data.session;
                            }
                            if (data.email !== undefined) {
                                noti['email'] = data.email;
                            }
                            if (data.found !== undefined) {
                                noti['found'] = true;
                            }
                            if (data.finished !== undefined) {
                                noti['finished'] = true;
                            }
                            db.noti.create(noti);
                        }
                    });
                });
            });
        }
    });