import React, { useState } from 'react';
import './Calculator.css'; // Импортируем файл со стилями

export const Calculator = () => {
	const [displayValue, setDisplayValue] = useState('0');
	const [firstOperand, setFirstOperand] = useState(null);
	const [operator, setOperator] = useState(null);
	const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

	const inputDigit = (digit) => {
		if (waitingForSecondOperand) {
			setDisplayValue(String(digit));
			setWaitingForSecondOperand(false);
		} else {
			setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit);
		}
	};

	const clearDisplay = () => {
		setDisplayValue('0');
		setFirstOperand(null);
		setOperator(null);
		setWaitingForSecondOperand(false);
	};

	const performOperation = (nextOperator) => {
		const inputValue = parseFloat(displayValue);

		if (firstOperand === null) {
			setFirstOperand(inputValue);
		} else if (operator) {
			const result = calculate(firstOperand, inputValue, operator);
			setDisplayValue(String(result));
			setFirstOperand(result);
		}

		setWaitingForSecondOperand(true);
		setOperator(nextOperator);
	};

	const calculate = (firstOperand, secondOperand, operator) => {
		switch (operator) {
			case '+':
				return firstOperand + secondOperand;
			case '-':
				return firstOperand - secondOperand;
			case '*':
				return firstOperand * secondOperand;
			case '/':
				return firstOperand / secondOperand;
			default:
				return secondOperand;
		}
	};

	const buttons = [
		'C',
		'7',
		'8',
		'9',
		'/',
		'4',
		'5',
		'6',
		'*',
		'1',
		'2',
		'3',
		'-',
		'.',
		'0',
		'+',
		'=',
	];

	return (
		<div className="calculator">
			<div className="display">{displayValue}</div>
			<div className="buttons">
				{buttons.map((button, index) => (
					<button
						key={index}
						onClick={() => {
							if (button === 'C') {
								clearDisplay();
							} else if (button === '=') {
								performOperation(button);
							} else if (!isNaN(button) || button === '.') {
								inputDigit(button);
							} else {
								performOperation(button);
							}
						}}
						className={button === '=' ? 'equals-button' : ''}
					>
						{button}
					</button>
				))}
			</div>
		</div>
	);
};
