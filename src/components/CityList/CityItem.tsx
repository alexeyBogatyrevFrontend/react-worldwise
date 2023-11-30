import { FC, MouseEvent } from 'react'
import { CityType } from '../../App'
import styles from './CityItem.module.css'
import { formatDate } from '../../utils/formatDate'
import { Link } from 'react-router-dom'
import { useCities } from '../../contexts/CitiesProvider'

type CityItemProps = {
	city: CityType
}

const CityItem: FC<CityItemProps> = ({ city }) => {
	const { currentCity, deleteCity } = useCities()
	const { cityName, emoji, date, id, position } = city

	const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		deleteCity(city.id)
	}

	return (
		<li>
			<Link
				to={`${id}?lat=${position.lat}&lng=${position.lng}`}
				className={`${styles.cityItem} ${
					Number(currentCity.id) === id ? styles['cityItem--active'] : ''
				}`}
			>
				<span className={styles.emoji}>{emoji}</span>
				<h3 className={styles.name}>{cityName}</h3>
				<time className={styles.date}>({formatDate(date)})</time>
				<button className={styles.deleteBtn} onClick={clickHandler}>
					&times;
				</button>
			</Link>
		</li>
	)
}

export default CityItem
