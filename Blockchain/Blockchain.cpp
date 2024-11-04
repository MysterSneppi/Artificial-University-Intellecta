#include "blockchain.h"

Blockchain::Blockchain() {
    chain.push_back(createGenesisBlock());
}

Block Blockchain::createGenesisBlock() {
    std::vector<Transaction> txs;
    return Block(0, txs, "0");
}

Block Blockchain::getLatestBlock() {
    return chain.back();
}

void Blockchain::addBlock(Block newBlock) {
    newBlock.previousHash = getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    chain.push_back(newBlock);
    pendingTransactions.clear();
}

bool Blockchain::isChainValid() {
    for (size_t i = 1; i < chain.size(); ++i) {
        Block currentBlock = chain[i];
        Block previousBlock = chain[i - 1];

        if (currentBlock.hash != currentBlock.calculateHash()) {
            return false;
        }

        if (currentBlock.previousHash != previousBlock.hash) {
            return false;
        }
    }
    return true;
}

void Blockchain::addTransaction(Transaction tx) {
    pendingTransactions.push_back(tx);
}

std::vector<Transaction> Blockchain::getPendingTransactions() const {
    return pendingTransactions;
}
