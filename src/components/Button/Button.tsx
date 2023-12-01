import { FC, ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonProps = {
	children?: ReactNode
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
	type?: string
}

const Button: FC<ButtonProps> = ({ children, onClick, type }) => {
	const buttonClassName = type ? `${styles.btn} ${styles[type]}` : styles.btn

	return (
		<button className={buttonClassName} onClick={onClick}>
			{children}
		</button>
	)
}

export default Button
