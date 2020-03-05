let nodes = 185;
let supply = 34001;
let c = 20;
let wallet_count = 907;
let burnt = 1284;
let transactions = 9402;
let avg_tps = 50
document.getElementById("nodes").innerHTML= nodes;
document.getElementById("supply").innerHTML= supply;
document.getElementById("tps").innerHTML= Math.round(((nodes / c)-5)-c) * avg_tps;
document.getElementById("wallets").innerHTML=  wallet_count;
/*
document.getElementById("burnt").innerHTML=  burnt;
*/
document.getElementById('blockList').innerHTML = " <tr> <th>Height</th> <th>Sender</th> <th>Txn Count</th> <th>Total Funds Change</th> <th>Recipitents</th> <th>Timestanp</th> </tr> ";
function addBlock(height,sender,txn_count,tfc, recipitents,timestamp) {
   
    let a = new Date(timestamp * 1000);
    let year = a.getFullYear();
    let month = a.getMonth();
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time = `${date}/${month}/${year} ${hour}:${min}:${sec}`;
   document.getElementById('blockList').innerHTML = document.getElementById('blockList').innerHTML + "<tr> <td><a href='/src/block?h=" + height +"'>"+height+"</td> </a> <a href='/src/wallets/chain?key=" + sender + "'> <td>"+sender+"</td> </a> <td>"+txn_count+"</td> <td>"+ tfc+" AIO</td> <td>"+recipitents+"</td> <td>"+time+"</td> </tr> ";
}

// test
addBlock(26,"0xe3Cd54f876f6740a39F71afeeesefedD886B1994",12,284, 12,1344345);
addBlock(26,"0xe3Cd54f876f6740a39F71a505cCBD1dD886B1994",12,284, 12,1344345);
addBlock(26,"0xe3Cd54f876f6740a39F71a505cCBD1dD886B1994",12,284, 12,1344345);
addBlock(26,"0xe3Cd54f876f6740a39F71a505cCBD1dD886B1994",12,284, 12,1344345);
addBlock(26,"0xe3Cd54f876f6740a39F71a505cCBD1dD886B1994",12,284, 12,1344345);
addBlock(26,"0xe3Cd54f876f6740a39F71a505cCBD1dD886B1994",12,284, 12,1344345);
addBlock(26,"0xe3Cd54f876f6740a39F71a505cCBD1dD886B1994",12,284, 12,1344345);
