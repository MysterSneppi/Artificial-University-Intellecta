#include <iostream>
#include "blockchain.h"

int main() {
    Blockchain eduChain;

    // Додамо транзакції
    eduChain.addTransaction(Transaction("student1", GRADE, "Math A", 0));
    eduChain.addTransaction(Transaction("student1", ATTENDANCE, "2024-11-04", 0));
    eduChain.addTransaction(Transaction("student1", SKILL, "C++ Programming", 0));
    eduChain.addTransaction(Transaction("student2", ENROLLMENT, "University XYZ", 0));
    eduChain.addTransaction(Transaction("student1", REWARD, "", 100));

    // Додамо блок
    Block newBlock = Block(1, eduChain.getPendingTransactions(), eduChain.getLatestBlock().hash);
    eduChain.addBlock(newBlock);

    std::cout << "Chain is valid: " << (eduChain.isChainValid() ? "Yes" : "No") << std::endl;

    return 0;
}
