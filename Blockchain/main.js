const {Blockchain, Transaction} = require('./blockchain');

let cattocoin = new Blockchain();
cattocoin.createTransaction(new Transaction('address1', 'address2', 100));
cattocoin.createTransaction(new Transaction('address2', 'address3', 50));

console.log("Starting Miner...... ");
cattocoin.minePendingTransactions('elon address');
console.log("Balance of elon is ", cattocoin.getBalanceofAddress('elon address'));

console.log("Starting Miner again...... ");
cattocoin.minePendingTransactions('elon address');
console.log("Balance of elon is ", cattocoin.getBalanceofAddress('elon address'));