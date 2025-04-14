#include "block.h"
#include <ctime>
#include <sstream>
#include <iomanip>

Block::Block(int idx, std::vector<Transaction> txs, std::string prevHash, std::string validator)
    : index(idx), transactions(txs), previousHash(prevHash), validatorId(validator) {
    timestamp = currentDateTime();
    hash = calculateHash();
}

std::string Block::calculateHash() {
    std::string toHash = std::to_string(index) + timestamp + previousHash + validatorId;
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

std::string Block::toString() {
    std::stringstream ss;
    ss << "Block index: " << index << "\n"
        << "Timestamp: " << timestamp << "\n"
        << "Previous hash: " << previousHash << "\n"
        << "Hash: " << hash << "\n"
        << "Validator: " << validatorId << "\n"
        << "Transactions:\n";

    for (const auto& tx : transactions) {
        ss << "  - Student ID: " << tx.studentID << "\n"
            << "    Type: " << (tx.type == GRADE ? "Grade" :
                tx.type == ATTENDANCE ? "Attendance" :
                tx.type == SKILL ? "Skill" :
                tx.type == ENROLLMENT ? "Enrollment" : "Reward") << "\n"
            << "    Details: " << tx.details << "\n"
            << "    Amount: $" << tx.amount << "\n";
    }

    return ss.str();
}
