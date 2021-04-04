var net = require('net');

var client = new net.Socket();
var init = false;
client.connect(17785, '127.0.0.1', function() {
	console.log('Connected to rpc');
	client.write('init');
});

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
			if (block.block_type = "Send") {
				let new_json = `{hash:${block.hash}, time: ${block.header.timestamp}, public_key: ${block.header.public_key}, links: [ {hash: ${block.header.prev_hash}, type: 0 } ] }`
				console.log(new_json)
			} else {
				let new_json = `{hash:${block.hash}, time: ${block.header.timestamp}, public_key: ${block.header.public_key}, links: [ {hash: ${block.header.prev_hash}, type: 0 }, {hash: ${block.send_block}, type: 1 } ] }`
				console.log(new_json)
			}
		}
	}
});

client.on('close', function() {
	console.log('rpc closed');
});
