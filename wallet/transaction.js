const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config')

class Transaction {
    constructor(){
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet, recipient, amount){
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if(amount > senderOutput.amount){
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }
        senderOutput.amount = senderOutput.amount-amount;
        this.outputs.push({ 
            amount,
            address: recipient
        })
        Transaction.signTransaction(this, senderWallet)
        return this;
    }

    static transactionWithOutputs(senderWallet, outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs)
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }


    static newTransaction(senderWallet, recipient, amount){
        
        if(amount > senderWallet.balance){
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }

        return Transaction.transactionWithOutputs(senderWallet, [
            { 
                amount: senderWallet.balance - amount ,
                address: senderWallet.publicKey
            },
            {
                amount, 
                address: recipient
            }
        ])
    }

    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet, [{
            amount: MINING_REWARD, address: minerWallet.publicKey
        }])
    }

    static logTransaction(transaction){
        console.log(`
            transaction
                id    :   ${transaction.id}
                input :   {
                    ${transaction.input.timestamp}
                    ${transaction.input.amount}
                    ${transaction.input.address.substring(0, 10)}
                    ${JSON.stringify(transaction.input.signature)}
                }
                output:   {
                    ${transaction.outputs[0].amount}
                    ${transaction.outputs[0].address.substring(0, 10)}

                    ${transaction.outputs[1].amount}
                    ${transaction.outputs[1].address.substring(0, 10)}
                }
        `);
    }

    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address, 
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        )
    }
}

module.exports = Transaction;