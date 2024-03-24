import { useState } from 'react';
import styles from './app.module.css';
import { getButtons } from './get-buttons';

export const CalculatorTaskRS = () => {
	const [operand1, setOperand1] = useState('0');
	const [operator, setOperator] = useState('');
	const [operand2, setOperand2] = useState('');
	const [isResult, setIsResult] = useState(false);

	const state = {
		operand1,
		setOperand1,
		operator,
		setOperator,
		operand2,
		setOperand2,
		isResult,
		setIsResult,
	};

	const buttons = getButtons(state);

	// const NUMS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
	const output = operand1 + operator + operand2;

	return (
		<div className={styles.app}>
			<div className={`${styles.screen} ${isResult ? styles.resultScreen : ''}`}>
				{output}
			</div>
			<div className={styles.buttons}>
				<div className={styles.leftGroup}>
					{buttons.map(({ id, label, group, handler }) =>
						group === 'left' ? (
							<button
								key={id}
								className={styles.button}
								onClick={() => handler(label)}
							>
								{label}
							</button>
						) : null,
					)}
				</div>
				<div className={styles.rightGroup}>
					{buttons.map(({ id, label, group, handler }) =>
						group === 'right' ? (
							<button key={id} className={styles.button} onClick={handler}>
								{label}
							</button>
						) : null,
					)}
				</div>
			</div>
		</div>
	);
};
