import { FC } from 'react'
import styles from './CountryItem.module.css'

type CountryItemProps = {
	country: { country: string; emoji: string }
}

const CountryItem: FC<CountryItemProps> = ({ country }) => {
	return (
		<li className={styles.countryItem}>
			<span>{country.emoji}</span>
			<span>{country.country}</span>
		</li>
	)
}

export default CountryItem
