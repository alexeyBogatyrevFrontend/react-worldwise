import { FC } from 'react'
import styles from './Message.module.css'

type MessageProps = {
	message: string
}

const Message: FC<MessageProps> = ({ message }) => {
	return (
		<p className={styles.message}>
			<span role='img'>👋</span> {message}
		</p>
	)
}

export default Message
