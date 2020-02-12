let nodes = 837;
let supply = 7901;
let c = 20;
let wallet_count = 907;
let burnt = 1284;
let transactions = 9402;

document.getElementById("nodes").innerHTML= nodes;
document.getElementById("supply").innerHTML= supply;
document.getElementById("tps").innerHTML= Math.round(((nodes / c)-5)-c);
document.getElementById("wallets").innerHTML=  wallet_count;
/*
document.getElementById("burnt").innerHTML=  burnt;
document.getElementById("txns").innerHTML=  transactions;
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
   document.getElementById('blockList').innerHTML = document.getElementById('blockList').innerHTML + "<tr> <td>"+height+"</td> <td>"+sender+"</td> <td>"+txn_count+"</td> <td>"+ tfc+" AIO</td> <td>"+recipitents+"</td> <td>"+time+"</td> </tr> ";
}


addBlock(26,"0xe3Cd54f876f6740a39F71a505cCBD1dD886B1994",12,284, 12,1344345);
addBlock(26,"0xe3Cd54f876f6740a39F71a505cCBD1dD886B1994",12,284, 12,1344345);
