#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>

enum TransactionType {
    GRADE,
    ATTENDANCE,
    SKILL,
    ENROLLMENT,
    REWARD
};

class Transaction {
public:
    std::string studentID;
    TransactionType type;
    std::string details;  // Описує деталі транзакції, наприклад, оцінка або навичка
    double amount;        // Використовується для винагород

    Transaction(std::string studentID, TransactionType type, std::string details, double amount = 0.0)
        : studentID(studentID), type(type), details(details), amount(amount) {
    }
};

#endif // TRANSACTION_H
