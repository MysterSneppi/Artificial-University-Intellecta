#ifndef POS_BLOCKCHAIN_H
#define POS_BLOCKCHAIN_H

#include "blockchain.h"
#include "validator.h"
#include <vector>
#include <cstdlib>

class PoSBlockchain : public Blockchain {
public:
    PoSBlockchain() : Blockchain() {}

    void addValidator(Validator validator) {
        validators.push_back(validator);
    }

    Validator selectValidator() {
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

private:
    std::vector<Validator> validators;
};

#endif 
