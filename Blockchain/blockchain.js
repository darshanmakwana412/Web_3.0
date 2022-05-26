const SHA256 = require('crypto-js/sha256');

class Transaction {

    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculatehash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signinkey) {

        if(signinkey.getPublic('hex')!== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets');
        }

        const hashTx = this.calculatehash();
        const sig = signinkey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0 ) {
            throw new Error('No signature in this transaction');
        }
    }

}

class Block {

    constructor(timestamp, transaction, previousHash='') {
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.calculatehash();
        this.nonce = 0;
    }

    calculatehash() {
        return SHA256( this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {

        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")) {
            this.nonce++;
            this.hash = this.calculatehash();
        }

        console.log("Block Mined : " + this.hash);

    }

}

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransaction = []
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.now(), "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty);

        console.log("Block Successfully mined!");
        this.chain.push(block);

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward),
        ]
    }

    createTransaction(transaction) {

        this.pendingTransaction.push(transaction);

    }

    getBalanceofAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transaction) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {

        for(let i=1 ; i<this.chain.length; i++ ) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if ( currentBlock.hash !== currentBlock.calculatehash() ) {
                return false;
            }

            if ( currentBlock.previousHash !== previousBlock.hash ) {
                return false;
            }
        }

        return true;

    }

}



module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;