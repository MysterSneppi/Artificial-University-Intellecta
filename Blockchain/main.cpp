#include "block.h"
#include "pos_blockchain.h"
#include <iostream>
#include <leveldb/db.h>

int main() {
    PoSBlockchain blockchain;

    // Добавляем валидаторов, как раньше
    blockchain.addValidator(Validator("Validator1", 100));
    blockchain.addValidator(Validator("Validator2", 50));
    blockchain.addValidator(Validator("Validator3", 200));

    std::cout << "Validators added: Validator1, Validator2, Validator3\n\n";

    // Инициализация LevelDB
    leveldb::DB* db;
    leveldb::Options options;
    options.create_if_missing = true;
    leveldb::Status status = leveldb::DB::Open(options, "leveldb_data", &db);

    if (!status.ok()) {
        std::cerr << "Failed to open LevelDB: " << status.ToString() << std::endl;
        return 1;
    }

    // Добавляем блоки и сохраняем их в LevelDB
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

    blockchain.addBlockByValidator(transactions1);
    std::cout << "Block 1 added by validator: " << blockchain.getLatestBlock().validatorId << "\n";
    std::string key1 = "block_" + std::to_string(blockchain.getLatestBlock().index);
    std::string value1 = blockchain.getLatestBlock().toString(); // Вы можете определить метод toString() для вашего блока
    db->Put(leveldb::WriteOptions(), key1, value1);  // Сохраняем блок в LevelDB

    blockchain.addBlockByValidator(transactions2);
    std::cout << "Block 2 added by validator: " << blockchain.getLatestBlock().validatorId << "\n";
    std::string key2 = "block_" + std::to_string(blockchain.getLatestBlock().index);
    std::string value2 = blockchain.getLatestBlock().toString();
    db->Put(leveldb::WriteOptions(), key2, value2);

    blockchain.addBlockByValidator(transactions3);
    std::cout << "Block 3 added by validator: " << blockchain.getLatestBlock().validatorId << "\n";
    std::string key3 = "block_" + std::to_string(blockchain.getLatestBlock().index);
    std::string value3 = blockchain.getLatestBlock().toString();
    db->Put(leveldb::WriteOptions(), key3, value3);

    // Проверяем, валидна ли цепочка
    if (blockchain.isChainValid()) {
        std::cout << "Blockchain is valid.\n\n";
    }
    else {
        std::cout << "Blockchain is not valid.\n\n";
    }

    // Извлекаем и выводим блок из LevelDB
    std::string retrieved_value;
    leveldb::Status get_status = db->Get(leveldb::ReadOptions(), key1, &retrieved_value);
    if (get_status.ok()) {
        std::cout << "Retrieved Block 1 from LevelDB: " << retrieved_value << "\n";
    }
    else {
        std::cout << "Failed to retrieve Block 1: " << get_status.ToString() << "\n";
    }

    delete db;  // Не забудьте удалить экземпляр базы данных

    return 0;
}
