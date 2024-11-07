#include "block.h"
#include "pos_blockchain.h"
#include <iostream>

int main() {
    PoSBlockchain blockchain;

    // Adding validators
    blockchain.addValidator(Validator("Validator1", 100));
    blockchain.addValidator(Validator("Validator2", 50));
    blockchain.addValidator(Validator("Validator3", 200));

    std::cout << "Validators added: Validator1, Validator2, Validator3\n\n";

    // Adding transactions
    std::vector<Transaction> transactions1 = {
        Transaction("StudentA", GRADE, "Math Exam", 0),
        Transaction("StudentB", ATTENDANCE, "Lecture 1", 0)
    };

    std::vector<Transaction> transactions2 = {
        Transaction("StudentC", SKILL, "Programming Skills", 0),
        Transaction("StudentD", ENROLLMENT, "Course Enrollment", 0)
    };

    std::vector<Transaction> transactions3 = {
        Transaction("StudentE", REWARD, "Scholarship Award", 500.0),
        Transaction("StudentF", REWARD, "Competition Prize", 1000.0)
    };

    // Adding blocks
    blockchain.addBlockByValidator(transactions1);
    std::cout << "Block 1 added by validator: " << blockchain.getLatestBlock().validatorId << " | Timestamp: " << blockchain.getLatestBlock().timestamp << "\n";

    blockchain.addBlockByValidator(transactions2);
    std::cout << "Block 2 added by validator: " << blockchain.getLatestBlock().validatorId << " | Timestamp: " << blockchain.getLatestBlock().timestamp << "\n";

    blockchain.addBlockByValidator(transactions3);
    std::cout << "Block 3 added by validator: " << blockchain.getLatestBlock().validatorId << " | Timestamp: " << blockchain.getLatestBlock().timestamp << "\n";

    // Checking chain validity
    if (blockchain.isChainValid()) {
        std::cout << "Blockchain is valid.\n\n";
    }
    else {
        std::cout << "Blockchain is not valid.\n\n";
    }

    // Displaying blocks
    for (const auto& block : blockchain.getChain()) {
        std::cout << "Block index: " << block.index << "\n"
            << "Timestamp: " << block.timestamp << "\n"
            << "Previous hash: " << block.previousHash << "\n"
            << "Hash: " << block.hash << "\n"
            << "Validator: " << block.validatorId << "\n"
            << "Transactions:\n";

        for (const auto& tx : block.transactions) {
            std::cout << "  - Student ID: " << tx.studentID << "\n"
                << "    Type: " << (tx.type == GRADE ? "Grade" :
                    tx.type == ATTENDANCE ? "Attendance" :
                    tx.type == SKILL ? "Skill" :
                    tx.type == ENROLLMENT ? "Enrollment" : "Reward") << "\n"
                << "    Details: " << tx.details << "\n"
                << "    Amount: $" << tx.amount << "\n";
        }
        std::cout << std::endl;
    }

    return 0;
}
