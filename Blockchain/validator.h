#ifndef VALIDATOR_H
#define VALIDATOR_H

#include <string>

class Validator {
public:
	Validator(std::string id, double stake) : id(id), stake(stake){}

	std::string getId() const { return id; }
	double getStake() const { return stake; };
	void addStake(double amount) { stake += amount; }

private:
	std::string id;
	double stake;
};
#endif
