#include "pos_blockchain.h"

PoSBlockchain::PoSBlockchain() : Blockchain () {}

void PoSBlockchain::addValidator(Validator validator) {
	validators.push_back(validator);
}

Validator PoSBlockchain::selectValidator() {
	double total_stake = 0.0;
	for (const auto& v : validators) {
		total_stake += v.getStake();
	}

	double randomPoint = (double)rand() / RAND_MAX * total_stake;
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
	Block newBlock(getChainSize(), transactions, getLatestBlock().hash);
	addBlock(newBlock);
}