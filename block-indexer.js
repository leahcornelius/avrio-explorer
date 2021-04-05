const start = async function() {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    var gini = require("gini");
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("avrioexplorer");
        const fetch = require('node-fetch');
        var net = require('net');

        var client = new net.Socket();
        var init = false;
        client.connect(17785, '127.0.0.1', function() {
            console.log('Connected to rpc');
            client.write('init');
        });
        var express = require("express");
        var app = express();
        var cors = require('cors')
        app.use(cors())
        var tot_json = `[`
        app.listen(1234, () => {
            console.log("API running on port 1234");
        });
        app.get("/dag", (req, res, next) => {
            res.json(tot_json + "]");
        });

        app.get("/lastten", (req, res, next) => {
            let blocks_cursor = dbo.collection("blocks").find().sort({ _id: -1 }).limit(10);

            blocks_cursor.toArray().then(array => {
                res.json(array);
            })
        })

        app.get("/chaincount", (req, res, next) => {
            fetch(`http://127.0.0.1:8000/api/v1/chainlist`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    if (myJson['success'] == true) {
                        res.json({ count: myJson['list'].length })
                    } else {
                        console.log("Failed to get chain count from node")
                        res.json({ count: 0 })
                    }
                })
        })

        app.get("/chainlist", (req, res, next) => {
            fetch(`http://127.0.0.1:8000/api/v1/chainlist`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    if (myJson['success'] == true) {
                        res.json(myJson['list'])
                    } else {
                        console.log("Failed to get chain count from node")
                        res.json([])
                    }
                })
        })
        app.get("/gini/:json_set", (req, res, next) => {
            // calculates the gini coefficent of the json encoded dataset
            data = JSON.parse(req.params.json_set);
            var result = gini.unordered(data);
            res.json({ result: result * 100 });
        })

        app.get("/username/:publickey", (req, res, next) => {
            // returns the username of an account
            fetch(`http://127.0.0.1:8000/api/v1/username_for_publickey/${req.params.publickey}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    if (myJson['success'] == true) {
                        res.json(myJson['username'])
                    } else {
                        console.log("Failed to get chain count from node")
                        res.json()
                    }
                })
        })

        app.get("/address/:publickey", (req, res, next) => {
            // returns the address of an publickey
            fetch(`http://127.0.0.1:8000/api/v1/publickey_to_address/${req.params.publickey}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    if (myJson['success'] == true) {
                        res.json(myJson['address'])
                    } else {
                        console.log("Failed to get chain count from node")
                        res.json()
                    }
                })
        })

        app.get("/balance/:chain", (req, res, next) => {
            fetch(`http://127.0.0.1:8000/api/v1/balances/${req.params.chain}`)
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    if (myJson['success'] == true) {
                        res.json(myJson)
                    } else {
                        console.log("Failed to get chain balance from node")
                        res.json([])
                    }
                })
        })

        app.get("/block/:hash", (req, res, next) => {
            let blocks_cursor = dbo.collection("blocks").find({ hash: req.params.hash });

            blocks_cursor.toArray().then(array => {
                if (typeof array[0] != 'undefined') {
                    console.log(array[0]);
                    res.json(array[0]);
                } else {
                    fetch(`http://127.0.0.1:8000/api/v1/blocks/${req.params.hash}`)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(myJson) {
                            console.log(myJson);
                            if (myJson['success'] == true) {
                                res.json(myJson['response']['block'])
                            } else {
                                console.log("Failed to get block from node")
                                res.json([])
                            }
                        })
                };
            });
        })

        client.on('data', function(data) {
            console.log('Received: ' + data);
            if (!init) {
                console.log("Not init, sending *");
                client.write('*');
                init = true;
            } else {
                var rec = JSON.parse(data)
                if (rec.m_type == "block") {
                    var block = JSON.parse(rec.content)
                    dbo.collection("blocks").insertOne(block, function(err, res) {
                        if (err) throw err;
                        console.log("1 block inserted");

                    });
                    if (block.block_type = "Send") {
                        let new_json = `{hash:${block.hash}, time: ${block.header.timestamp}, public_key: ${block.header.chain_key}, links: [ {hash: ${block.header.prev_hash}, type: 0 } ] },`

                        tot_json = tot_json + new_json
                    } else {
                        let new_json = `{hash:${block.hash}, time: ${block.header.timestamp}, public_key: ${block.header.chain_key}, links: [ {hash: ${block.header.prev_hash}, type: 0 }, {hash: ${block.send_block}, type: 1 } ] },`
                        tot_json = tot_json + new_json
                    }
                } else {
                    console.log(`Recieved non block msg, type=${rec.m_type}`)
                }
                console.log(tot_json)
            }
        });

        client.on('close', function() {
            console.log('rpc closed');
        });
    });
}
start();