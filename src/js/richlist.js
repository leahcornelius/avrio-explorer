let balances = {}
let chainlist = []

function doStuff() {
    fetch(CONFIG.getValue('node_ip') + "/chaincount")
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            document.getElementById('wallets').innerHTML = myJson['count'];
        });
    document.getElementById('tableOfChains').innerHTML = ` <tr> <th class="tooltip">Chain</th> <th>Username</th> <th>Txn Count</th> <th>Balance</th> <th>Locked</th> <th>Rank</th> </tr> `;
    fetch(CONFIG.getValue('node_ip') + "/chainlist")
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            chainlist = myJson;
            for (index in chainlist) {
                let chainkey = chainlist[index]
                fetch(CONFIG.getValue('node_ip') + `/balance/${chainkey}`)
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(myJson) {
                        fetch(CONFIG.getValue('node_ip') + `/username/${chainkey}`)
                            .then(function(response) {
                                return response.json();
                            })
                            .then(function(username_json) {
                                fetch(CONFIG.getValue('node_ip') + `/balance/${chainkey}`)
                                    .then(function(response) {
                                        return response.json();
                                    })
                                    .then(function(myJson) {
                                        fetch(CONFIG.getValue('node_ip') + `/address/${chainkey}`)
                                            .then(function(response) {
                                                return response.json();
                                            })
                                            .then(function(address_json) {
                                                balances[chainkey] = { balance: myJson['balance'], locked: myJson['locked'], username: username_json, txn_count: 0, address: address_json };

                                            })
                                    })
                            })
                    })
            }
        });
    populate_table()
}

function populate_table() {
    document.getElementById('tableOfChains').innerHTML = ` <tr> <th class="tooltip">Chain</th> <th>Username</th> <th>Txn Count</th> <th>Balance</th> <th>Locked</th> <th>Rank</th> </tr> `;
    // Create items array
    var items = Object.keys(balances).map(function(key) {
        return [key, balances[key]];
    });

    // Sort the array based on the second element
    items.sort(function(first, second) {
        return second[1]['balance'] - first[1]['balance'];
    });
    let list_for_gini = []
    for (chain in items) {
        bal = items[chain][1];
        list_for_gini.push(bal['balance'])
        console.log(bal)
        document.getElementById('tableOfChains').innerHTML = document.getElementById('tableOfChains').innerHTML + "<tr> <td>" +
            bal['address'] + "</td><td>" + bal['username'] + "</td><td>" + bal['txn_count'] + "</td><td>" + bal['balance'] / 10000 + "</td><td>" + bal['locked'] / 10000 + "</td><td>" + (parseInt(chain) + 1) + "</td></tr>"

    }
    do_the_gini_thing(list_for_gini)
}

function do_the_gini_thing(gini) {
    if (gini.length > 0) {
        fetch(CONFIG.getValue('node_ip') + `/gini/${JSON.stringify(gini)}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                document.getElementById("gini").innerHTML = myJson['result'].toFixed(4);
            });
    } else {
        document.getElementById("gini").innerHTML = 0;
    }
}
doStuff()

window.setInterval(function() {
    doStuff()

}, 2500);