#include "block.h"
#include <ctime>
#include <sstream>
#include <iomanip>

Block::Block(int idx, std::vector<Transaction> txs, std::string prevHash)
    : index(idx), transactions(txs), previousHash(prevHash) {
    timestamp = currentDateTime();
    hash = calculateHash();
}

std::string Block::calculateHash() {
    std::string toHash = std::to_string(index) + timestamp + previousHash;
    for (const auto& tx : transactions) {
        toHash += tx.studentID + std::to_string(tx.type) + tx.details + std::to_string(tx.amount);
    }

    unsigned char hashResult[SHA256_DIGEST_LENGTH];
    SHA256(reinterpret_cast<const unsigned char*>(toHash.c_str()), toHash.size(), hashResult);

    std::stringstream ss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; ++i) {
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)hashResult[i];
    }
    return ss.str();
}

std::string Block::currentDateTime() {
    time_t now = time(0);
    tm ltm;
    localtime_s(&ltm, &now); // Безпечний варіант localtime
    char buffer[80];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d %X", &ltm);
    return std::string(buffer);
}

