function do_stuff() {
    let nodes = 0;
    let supply = 0;
    let c = 0;
    let wallet_count = 0;
    let burnt = 0;
    let transactions = 0;
    let avg_tps = 50
    document.getElementById('blockList').innerHTML = " <tr> <th>Height</th> <th>Sender</th> <th>Txn Count</th> <th>Total Funds Change</th> <th>Recipitents</th> <th>Timestanp</th> </tr> ";
    function addBlock(height, sender, txn_count, tfc, recipitents, timestamp) {

        let a = new Date(timestamp * 1000);
        let year = a.getFullYear();
        let month = a.getMonth();
        let date = a.getDate();
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        let time = `${date}/${month}/${year} ${hour}:${min}:${sec}`;
        document.getElementById('blockList').innerHTML = document.getElementById('blockList').innerHTML + "<tr> <td><a href='/src/block.html?h=" + height + "'>" + height + "</a></td> <a href='/src/wallets/chain.html?key=" + sender + "'> <td>" + sender + "</td> </a> <td>" + txn_count + "</td> <td>" + tfc + " AIO</td> <td>" + recipitents + "</td> <td>" + time + "</td> </tr> ";
    }
    fetch("http://127.0.0.1:1234/lastten")
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            console.log(myJson);
            var blocks = myJson;
            for (var block_index in blocks) {
                let block = blocks[block_index];
                console.log(block);
                let funds_change = 0;
                let txn_count = 0;
                for (var i in block['txns']) {
                    let txn = block['txns'][i];
                    console.log(txn);
                    if (txn['flag'] == "c" && block['block_type'] == "Recieve") {
                        supply += txn['amount'] / 10000;
                        document.getElementById("supply").innerHTML = supply;


                    } else if (txn['flag'] == "u" && block['block_type'] == "Recieve") {
                        supply -= txn['amount'] / 10000;
                        document.getElementById("supply").innerHTML = supply;
                    }
                    txn_count += 1;
                    funds_change += txn['amount'];
                }
                let dec = funds_change / 10000;
                addBlock(block['header']['height'], block['hash'], txn_count, dec, 0, block['header']['timestamp'] / 1000);
            }
        })
        .catch(function (error) {
            console.log("Error: " + error);
        });
    console.log(supply)
    document.getElementById("nodes").innerHTML = nodes;
    document.getElementById("supply").innerHTML = supply;
    document.getElementById("tps").innerHTML =/* Math.round(((nodes / c) - 5) - c) * */avg_tps;
    document.getElementById("wallets").innerHTML = wallet_count;
    /*
    document.getElementById("burnt").innerHTML=  burnt;
    */
}
do_stuff() // call once to prevent a 5 second delay on first page load
window.setInterval(function () {
    do_stuff()
}, 5000);