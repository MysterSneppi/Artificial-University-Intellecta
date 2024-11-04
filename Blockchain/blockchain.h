#ifndef BLOCKCHAIN_H
#define BLOCKCHAIN_H

#include "block.h"
#include <vector>

class Blockchain {
public:
    Blockchain();

    void addBlock(Block newBlock);
    bool isChainValid();
    void addTransaction(Transaction tx);

    std::vector<Transaction> getPendingTransactions() const;
    Block getLatestBlock();

private:
    std::vector<Block> chain;
    std::vector<Transaction> pendingTransactions;

    Block createGenesisBlock();
};

#endif // BLOCKCHAIN_H
