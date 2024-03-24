import { Calculator } from './Calculator';
import styles from './app.module.css';
import { CalculatorTaskRS } from './CalculatorTaskRS';

export const App = () => {
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();

	console.log(currentYear);

	return (
		<div className={styles.app}>
			<header className={styles.header}>
				<Calculator />
				<CalculatorTaskRS />
			</header>
		</div>
	);
};
