export const handleResult = ({
	operand1,
	setOperand1,
	operand2,
	setOperand2,
	operator,
	setOperator,
	setIsResult,
}) => {
	if (operand2 !== '') {
		switch (operator) {
			case '+': {
				setOperand1(Number(operand1) + Number(operand2));
				break;
			}
			case '-': {
				setOperand1(Number(operand1) - Number(operand2));
				break;
			}
			case '*': {
				setOperand1(Number(operand1) * Number(operand2));
				break;
			}
			default:
			// ничего не делаем
		}
		setOperand2('');
	}
	setOperator('');
	setIsResult(true);
};
