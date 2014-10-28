process.on('message', function (m) {
    if (m === 'start') {
        var csv = require('csv');
        var db = require('./models');
        var checkData = require('child_process').fork('check.js');
        var check = true;


        var net = require('net');
        var client = new net.Socket();
        var info = '';
        var connection = false;
        var ip = ''; //ip address

        client.connect(7412, ip);//137.205.116.36


        client.on('data', function (data) {
            info+=data;
        });
        checkData.on('message', function (m) {
            if (m === 'done') {
                check = true;
            } else {
                process.send(m);
            }
        });
        setInterval(function () {
            if (check) {
                if(info !== ''){
                    var temp  = info;
                    info = '';
                    createObject(temp);
                } else {
                    checkData.send('handle');
                    check = false;
                }
           
            }
        }, 1000);

        client.on('close', function () {
            setTimeout(function () {

                if(connection){
                    connection = false;
                    process.send(['connection',false]);
                }
                client.connect(7412, ip);
            }, 2000);
            console.log('Connection closed');
        });
        client.on('connect', function () {
            if(!connection){
                connection = true;
                process.send(['connection',true]);
            }
        });
        client.on('error', function (e) {
            console.log('Not working...');
            client.destroy();

        });
    }
    function createObject(data){
        var arr = [];
        csv().from.string(data).on('record', function(row){
            if (row[0] !== 'time'){
                var str = {};
                str["time"] = row[0];
                str["tradeprice"] = row[1];
                str["tradesize"] = row[2];
                str["buyer"] = row[3];
                str["seller"] = row[4];
                str["symbol"] = row[5];
                str["currency"] = row[6];
                str["bid"] = row[7];
                str["ask"] = row[8];
                str["open"] = row[9];
                str["prevclose"] = row[10];
                arr.push(str);
            }
        }).on('end', function(count){
            handleObject(arr);
        });
    }
    function handleObject(arr){
        db.tempstock.bulkCreate(arr).success(function () {
            checkData.send('handle');
            check = false;
        });
    }
});