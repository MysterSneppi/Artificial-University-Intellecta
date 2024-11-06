#ifndef POS_BLOCKHAIN_H
#define POS_BLOCKHAIN_H

#include "blockchain.h"
#include "validator.h"
#include <vector>
#include <cstdlib>

class PoSBlockchain : public Blockchain {
public:
	PoSBlockchain(): Blockchain(){}

	void addValidator(Validator validator) {
		validators.push_back(validator);
	}

	Validator selectValidator() {
		double total_stake = 0.0;
		for (const auto &v:validators) {
			total_stake += v.getStake();
		}

		double randomPoint = (double)rand() / RAND_MAX * total_stake;
		double currentStake = 0.0;

		for (const auto  &v:validators) {
			currentStake += v.getStake();
			if (currentStake >= randomPoint) {
				return v;
			}
		}
		
		return validators[0];
	}


private:
	std::vector<Validator> validators;
};



#endif
