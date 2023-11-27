import { FC } from 'react'
import { CityType } from '../../App'
import styles from './CityItem.module.css'
import { formatDate } from '../../utils/formatDate'

type CityItemProps = {
	city: CityType
}

const CityItem: FC<CityItemProps> = ({ city }) => {
	const { cityName, emoji, date } = city

	return (
		<li className={styles.cityItem}>
			<span className={styles.emoji}>{emoji}</span>
			<h3 className={styles.name}>{cityName}</h3>
			<time className={styles.date}>({formatDate(date)})</time>
			<button className={styles.deleteBtn}>&times;</button>
		</li>
	)
}

export default CityItem
