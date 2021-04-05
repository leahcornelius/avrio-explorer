const byteSize = str => new Blob([str]).size;

function splitString(str) {
    var middle = Math.ceil(str.length / 2);
    var s1 = str.slice(0, middle);
    var s2 = str.slice(middle);
    return s1;
};

function addTxn(hash, fee, sender, reciever, amount, txn_type, txn_size) {
    if (txn_type == "c") {
        document.getElementById('transactions_rows').innerHTML = document.getElementById('transactions_rows').innerHTML +
            "<tr> <td> <a href='/src/transaction.html?hash=" + hash +
            "'>" + hash + "</a></td> <td>" + fee +
            " AIO</td> <td>" + amount / 10000 +
            " AIO</td> <td>" +
            splitString(sender) +
            "</td>  <td>" + splitString(reciever) + "  </td><td> Claim </td> <td>" +
            txn_size / 1000 +
            " kB</td> </tr> ";
    } else if (txn_type = "n") {
        document.getElementById('transactions_rows').innerHTML = document.getElementById('transactions_rows').innerHTML +
            "<tr> <td> <a href='/src/transaction.html?hash=" + hash +
            "'>" + splitString(hash) + "...</a></td> <td>" + fee +
            " AIO</td> <td>" + amount / 10000 +
            " AIO</td> <td>" +
            splitString(sender) +
            "...</td>  <td>" + splitString(reciever) + "...</td><td> Normal </td> <td>" +
            txn_size / 1000 +
            " kB</td> </tr> ";
    } else if (txn_type = "u") {
        document.getElementById('transactions_rows').innerHTML = document.getElementById('transactions_rows').innerHTML +
            "<tr> <td> <a href='/src/transaction.html?hash=" + hash +
            "'>" + splitString(hash) + "...</a></td> <td>" + fee +
            " AIO</td> <td>" + amount / 10000 +
            " AIO</td> <td>" +
            splitString(sender) +
            "...</td>  <td>" + splitString(reciever) + "...</td><td> Register Username </td> <td>" +
            txn_size / 1000 +
            " kB</td> </tr> ";
    } else if (txn_type = "b") {
        document.getElementById('transactions_rows').innerHTML = document.getElementById('transactions_rows').innerHTML +
            "<tr> <td> <a href='/src/transaction.html?hash=" + hash +
            "'>" + splitString(hash) + "...</a></td> <td>" + fee +
            " AIO</td> <td>" + amount / 10000 +
            " AIO</td> <td>" +
            splitString(sender) +
            "...</td>  <td>" + splitString(reciever) + "...</td><td> Burn </td> <td>" +
            txn_size / 1000 +
            " kB</td> </tr> ";
    } else {
        document.getElementById('transactions_rows').innerHTML = document.getElementById('transactions_rows').innerHTML +
            "<tr> <td> <a href='/src/transaction.html?hash=" + hash +
            "'>" + splitString(hash) + "...</a></td> <td>" + fee +
            " AIO</td> <td>" + amount / 10000 +
            " AIO</td> <td>" +
            splitString(sender) +
            "...</td>  <td>" + splitString(reciever) + "...</td><td> Unknown </td> <td>" +
            txn_size / 1000 +
            " kB</td> </tr> ";
    }
}
let params = new URLSearchParams(location.search);
let hash = params.get('hash');
if (hash != undefined) {
    // get this block
    let res;
    fetch(CONFIG.getValue('node_ip') + `/block/${hash}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            console.log(myJson);

            document.getElementById('hash').innerHTML = myJson['hash'];
            document.getElementById('height').innerHTML = myJson['header']['height'];
            document.getElementById('chain').innerHTML = myJson['header']['chain_key'];
            let a = new Date(myJson['header']['timestamp']);
            let year = a.getFullYear();
            let month = a.getMonth();
            let date = a.getDate();
            let hour = a.getHours();
            let min = a.getMinutes();
            let sec = a.getSeconds();
            let time = `${date}/${month}/${year} ${hour}:${min}:${sec}`;
            document.getElementById('time').innerHTML = time;
            var funds_change = 0;
            var transaction_count = 0;
            for (var i in myJson['txns']) {
                let txn = myJson['txns'][i];

                funds_change += parseInt(txn['amount']);
                transaction_count += 1;
                addTxn(txn['hash'], (txn['gas'] * txn['gas_price']) / 10000, txn['sender_key'], txn['receive_key'], txn['amount'], txn['flag'], byteSize(JSON.stringify(txn)))
            }
            document.getElementById('transaction_count').innerHTML = transaction_count;
            document.getElementById('total_funds_change').innerHTML = funds_change / 10000;
            document.getElementById('signature').innerHTML = myJson['signature'];
            document.getElementById('prev_hash').innerHTML = myJson['header']['prev_hash'];
            document.getElementById('block_type').innerHTML = myJson['block_type']
            if (myJson['block_type'] != "Send") {

                document.getElementById('hash_of_send_block').innerHTML = "<h4> <b>Send Block hash: </b> <span id='send_block_hash'></span></h4>"
                document.getElementById('send_block_hash').innerHTML = myJson['send_block']
            }

        })
        .catch(function(error) {
            console.log("Error: " + error);
        });


}