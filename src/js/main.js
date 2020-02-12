let nodes = 837;
let supply = 14,306;
let c = 20;
let wallet_count = 907;
let burnt = 1284;
let transactions = 9402;

document.getElementById("nodes").textContent= nodes;
document.getElementById("supply").textContent= supply;
document.getElementById("tps").textContent= ((nodes / c)-5)-c;
document.getElementById("wallets").textContent=  wallet_count;
/*
document.getElementById("burnt").textContent=  burnt;
document.getElementById("txns").textContent=  transactions;
*/
