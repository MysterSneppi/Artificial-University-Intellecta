#ifndef POS_BLOCKСHAIN_H
#define POS_BLOCKСHAIN_H

#include "blockchain.h"
#include "validator.h"
#include <vector>
#include <cstdlib>

class PoSBlockchain : public Blockchain {
public:
	PoSBlockchain();
	void addValidator(Validator validator);
	Validator selectValidator();
	void addBlockByValidator(std::vector<Transaction> transactions);

private:
	std::vector<Validator> validators;
};
#endif
