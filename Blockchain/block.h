#ifndef BLOCK_H
#define BLOCK_H

#include <string>
#include <vector>
#include "transaction.h"
#include <openssl/sha.h>

class Block {
public:
    int index;
    std::string timestamp;
    std::vector<Transaction> transactions;
    std::string previousHash;
    std::string hash;

    Block(int idx, std::vector<Transaction> txs, std::string previousHash);

    std::string calculateHash();

private:
    std::string currentDateTime();
};

#endif // BLOCK_H
