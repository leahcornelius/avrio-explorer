var net = require('net');

var client = new net.Socket();
var init = false;
client.connect(17785, '127.0.0.1', function () {
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

client.on('data', function (data) {
	console.log('Received: ' + data);
	if (!init) {
		console.log("Not init, sending *");
		client.write('*');
		init = true;
	} else {
		var rec = JSON.parse(data)
		if (rec.m_type == "block") {

			var block = JSON.parse(rec.content)
			console.log(block.block_type)
			if (block.block_type = "Send") {
				if (block.header.prev_hash == "00000000000") {
					let new_json = `{"hash":"${block.hash}", "time": ${block.header.timestamp}, "chain_key": "${block.header.chain_key}", "links": [] }`
					if (tot_json = '[') {
						tot_json = tot_json + new_json
					} else {
						tot_json = tot_json + "," + new_json
					}
				} else {
					let new_json = `{"hash":"${block.hash}", "time": ${block.header.timestamp}, "chain_key": "${block.header.chain_key}", "links": [ {"hash": "${block.header.prev_hash}", "type": 0 } ] }`

					if (tot_json = '[') {
						tot_json = tot_json + new_json
					} else {
						tot_json = tot_json + "," + new_json
					}
				}
			} else {
				if (block.header.prev_hash == "00000000000") {
					let new_json = `{"hash":"${block.hash}"", "time": ${block.header.timestamp}, "chain_key": "${block.header.chain_key}", "links": [ {"hash": "${block.send_block}", "type": 1 } ] }`

					if (tot_json = '[') {
						tot_json = tot_json + new_json
					} else {
						tot_json = tot_json + "," + new_json
					}
				} else {
					let new_json = `{"hash":"${block.hash}", "time": ${block.header.timestamp}, "chain_key": "${block.header.chain_key}", "links": [ {"hash": "${block.header.prev_hash}", "type": 0 }, {"hash": "${block.send_block}", "type": 1 } ] }`
					if (tot_json = '[') {
						tot_json = tot_json + new_json
					} else {
						tot_json = tot_json + "," + new_json
					}
				}
			}
		} else {
			console.log(`Recieved non block msg, type=${rec.m_type}`)
		}
	}
});

client.on('close', function () {
	console.log('rpc closed');
});
