#include "pos_blockchain.h"

PoSBlockchain::PoSBlockchain() : Blockchain() {}

void PoSBlockchain::addValidator(Validator validator) {
    validators.push_back(validator);
}

Validator PoSBlockchain::selectValidator() {
    double totalStake = 0.0;
    for (const auto& v : validators) {
        totalStake += v.getStake();
    }

    double randomPoint = (double)rand() / RAND_MAX * totalStake;
    double currentStake = 0.0;
    for (const auto& v : validators) {
        currentStake += v.getStake();
        if (currentStake >= randomPoint) {
            return v;
        }
    }
    return validators[0];
}

void PoSBlockchain::addBlockByValidator(std::vector<Transaction> transactions) {
    Validator validator = selectValidator();
    int newIndex = getChainSize();
    std::string previousHash = getLatestBlock().hash;

    Block newBlock(newIndex, transactions, previousHash, validator.getId());
    addBlock(newBlock);
}
