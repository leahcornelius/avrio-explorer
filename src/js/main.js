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
