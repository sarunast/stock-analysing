var db = require('./models')
Date.prototype.addMinutes = function(minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
};

Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours() + hours);
    return this;
};
Date.prototype.addSeconds = function(seconds) {
    this.setSeconds(this.getSeconds() + seconds);
    return this;
};
exports.querydis = function (io, data) {
    // pull the form variables off the request body
    var getelement = /(^[ \(]*[A-Za-z0-9\.']+[ \)]*)(.+)$/;
    var getoperator = /^[ \)]* *(=|<|>|<=|>=|!=|\+|\-|\*|\/)[ \(]*(.+)$/;
    var identifier = /^[ \(]* *('[A-Za-z\.]+'|[0-9]+(\.[0-9]+)?)[ \)]*$/;
    var variable = /^[ \(]*(tradeprice|tradesize|buyer|seller|symbol|currency|bid|ask|open|prevclose)[ \)]*$/;
    var eval = /^[ \)]*(=|<|>|<=|>=|!=)[ \(]*$/;
    var operator = /^[ \)*(\+|\-|\*|\/)[ \(]*$/;
    var eof = /^ *('[A-Za-z\.]+'|[0-9]+(\.[0-9]+)?|=|<|>|<=|>=|!=|\+|\-|\*|\/|and|AND|or|OR|tradeprice|tradesize|buyer|seller|symbol|currency|bid|ask|open|prevclose)[ \)]*$/;
    var connectors = /^[ \)]*(and|AND|or|OR)[ \(]*(.+)$/;
    ////
    ////
    ////
    var newtime = new Date();
    console.log(newtime);
    var notifyObj = {};
    var queryObj = {query: "1=1", sort: "", agg: "*", forever: false, completed: 0, count: 0, createdAt: newtime, sessionID: data.session};
    var verify = true;
    var query = data.query.split("|");
    console.log(query);
    if (data.query.length == 0) {
        verify = false;
    }
    query.forEach(function (entry) {
        try {
            if (verify && entry.length > 0) {
                if (/^ *noti *\(.*\) *$/.test(entry)) {
                    //notifyObj = {found:0,finished:0,browser:0}
                    notify(entry.match(/^ *noti *\((.*?)\) *$/)[1]);
                } else if (/^ *ttl *\(.*\) *$/.test(entry)) {
                    ttl(entry.match(/^ *ttl *\((.*?)\) *$/)[1]);
                } else if (/^ *agg *\(.*\) *$/.test(entry)) {
                    agg(entry.match(/^ *agg *\((.*?)\) *$/)[1]);
                } else if (/^ *sort *\(.*\) *$/.test(entry)) {
                    sortfunc(entry.match(/^ *sort *\((.*?)\) *$/)[1]);
                } else if (/^ *con *\(.*\) *$/.test(entry)) {
                    con(entry.match(/^ *con *\((.*?)\) *$/)[1]);
                } else {
                    verify = false;
                }
            }
        } catch (err) {
            console.log('wrong');
            verify = false;
        }
    });
    function sortfunc(str) {
        if (/^ *order +by[ \(]+(tradeprice|tradesize|buyer|seller|symbol|currency|bid|ask|open|prevclose)[ \)]*([ \)]*(\+|\-|\*|\/)[ \(]*(tradeprice|tradesize|buyer|seller|symbol|currency|bid|ask|open|prevclose)[ \)]*)* *(asc|desc) *(limit *[0-9]+)? *$/.test(str)) {
            queryObj['sort'] = str;
            finalfunc(str);
            console.log(str);
        } else {
            console.log('wrong');
            verify = false;
        }
    }

    function agg(str) {
        console.log(str);
        var getelementAgg = /(^[ \(]*[A-Za-z0-9]+[ \)]*)(.+)$/;
        var getoperatorAgg = /^[ \)]* *(\+|\-|\*|\/)[ \(]*(.+)$/;
        var identifierAgg = /^[ \(]* *([0-9]+(\.[0-9]+)?)[ \)]*$/;
        var variableAgg = /^[ \(]*(tradeprice|tradesize|buyer|seller|symbol|currency|bid|ask|open|prevclose)[ \)]*$/;
        var operatorAgg = /^[ \)*(\+|\-|\*|\/)[ \(]*$/;
        var eofAgg = /^[ \(]*([A-Za-z0-9]+|\+|\-|\*|\/|tradeprice|tradesize|buyer|seller|symbol|currency|bid|ask|open|prevclose)[ \)]*$/;
        var getfunAgg = /(sum\(|avg\(|count\(|max\(|min\()/g;

        queryObj['agg'] = str;
        if (str.match(getfunAgg) === null || str.match(getfunAgg).length < 4) {
            startagg(str.replace(/(sum|avg|count|max|min)/g, ""));
        } else {
            console.log('wrong');
            verify = false;
        }
        function startagg(str, varcount) {
            console.log(str)
            var arr = str.match(getelementAgg);

            console.log(arr);
            if (eofAgg.test(str)) {
                if (variableAgg.test(str)) {
                    finalfunc(queryObj['agg']);

                } else if (varcount > 0 && identifierAgg.test(str)) {
                    finalfunc(queryObj['agg']);
                } else {
                    console.log('wrong');
                    verify = false;
                }

            } else if (variableAgg.test(arr[1])) {
                evalfuncagg(arr[2], varcount + 1);
            } else if (identifierAgg.test(arr[1])) {
                evalfuncagg(arr[2], varcount);
            } else {
                console.log('wrong');
                verify = false;
            }
        }

        function evalfuncagg(str, varcount) {
            var arr = str.match(getoperatorAgg);
            console.log(arr);
            if (!eofAgg.test(str)) {
                if (operatorAgg.test(arr[1])) {
                    startagg(arr[2], varcount);
                } else {
                    console.log('wrong');
                    verify = false;
                }
            } else {
                console.log('wrong');
                verify = false;
            }
        }
    }

    function notify(str) {
        var arr = str.replace(/ /g, "").split(",");
        var way = false;
        var info = false;
        arr.forEach(function (entry) {
            if (entry === 'found') {
                way = true;
                notifyObj['found'] = true;
            } else if (entry === 'finished') {
                way = true;
                notifyObj['finished'] = true;
            } /*else if (/^[0-9]*.[0-9]*$/.test(entry)){
             time = entry.split(".");
             notifyObj['endtime'] = new Date().addHours(Number(time[0])).addMinutes(Number(time[1]));
             }*/ else if (entry === 'browser') {
                info = true
                notifyObj['browser'] = data.session;
            } else if (/^email=/.test(entry)) {
                info = true
                notifyObj['email'] = entry.split("=")[1];
            } else {
                console.log('wrong');
                verify = false;
            }

        });
        if (way && !info) {
            notifyObj['browser'] = data.session;
        } else if (info && !way) {
            notifyObj['finished'] = true;
        } else if (!info && !way) {
            verify = false;
        }
    }

    function ttl(str) {
        if (/^ *found *$/.test(str)) {
            queryObj['forever'] = false;
        } else if (/^ *forever *$/.test(str)) {
            queryObj['forever'] = true;
        } else if (/^ *[0-9]*.[0-9]* *$/.test(str)) {
            time = str.replace(/[ ]/g, "").split(".");
            queryObj['endtime'] = new Date().addHours(Number(time[0])).addMinutes(Number(time[1]));
        } else if (/^ *[0-9]*.[0-9]*.[0-9]* *$/.test(str)) {
            time = str.replace(/[ ]/g, "").split(".");
            queryObj['endtime'] = new Date().addHours(Number(time[0])).addMinutes(Number(time[1])).addSeconds(Number(time[2]));
        }  else {
            console.log('wrong');
            verify = false;
        }
    }

    function con(str) {
        queryObj['query'] = str;
        start(str, 0, 0);
    }

    ///////////////////////
    ////////////////////// Check condition
    ///////////////////////
    function start(str, nest, varcount) {
        var arr = str.match(getelement);
        if (eof.test(str)) {
            if (nest > 0 && variable.test(str)) {
                finalfunc(queryObj['query']);
            } else if (nest > 0 && varcount > 0 && identifier.test(str)) {
                finalfunc(queryObj['query']);
            } else {
                console.log('wrong');
                verify = false;
            }

        } else if (variable.test(arr[1])) {
            if (nextcheck(arr[2], nest, varcount + 1)) {
                start(arr[2].match(connectors)[2], 0, 0);
            } else {
                evalfunc(arr[2], nest, varcount + 1);
            }
        } else if (identifier.test(arr[1])) {
            if (nextcheck(arr[2], nest, varcount + 1)) {
                start(arr[2].match(connectors)[2], 0, 0);
            } else {
                evalfunc(arr[2], nest, varcount);
            }
        } else {
            console.log('wrong');
            verify = false;
        }
    }

    function nextcheck(str, nest, varcount) {
        if (nest > 0 && varcount > 0 && connectors.test(str) && !eof.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    function evalfunc(str, nest, varcount) {
        var arr = str.match(getoperator);
        if (!eof.test(str)) {
            if (eval.test(arr[1]) && nest < 1) {
                start(arr[2], nest + 1, varcount);
            } else if (operator.test(arr[1])) {
                start(arr[2], nest, varcount);
            } else {
                console.log('wrong');
                verify = false;
            }
        } else {
            console.log('wrong');
            verify = false;
        }
    }

    function finalfunc(strmain) {
        //var
        str = strmain.replace(/[\d\w' =><\+\-\*\/\.]/g, "");
        if (str === '') {
            console.log('right');
        } else if (str.charAt(0) === '(') {
            bracket(str.substring(1), 1);
        } else {
            console.log('wrong');
            verify = false;
        }
    }

    function bracket(str, num) {
        if (num >= 0 && str.charAt(0) === '(') {
            bracket(str.substring(1), num + 1);
        } else if (num >= 0 && str.charAt(0) === ')') {
            bracket(str.substring(1), num - 1);
        } else if (str === '' && num == 0) {
            console.log('right');
        } else {
            console.log('wrong');
            verify = false;
        }
    }

    function isEmpty(ob) {
        for (var i in ob) {
            return false;
        }
        return true;
    }

    if (verify) {
        db.uquery.create(queryObj).success(function (data) {
            console.log(data);
            if (!isEmpty(notifyObj)) {
                notifyObj['uqueryId'] = data.id;
                db.noti.create(notifyObj);
            }
            io.sockets.emit('query', data);
        });
    } else {
        io.sockets.in(data.session).emit('query', { query: false });
    }
    console.log(notifyObj, queryObj);


};