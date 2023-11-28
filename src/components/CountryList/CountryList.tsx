import styles from './CountryList.module.css'
import Spinner from '../Spinner/Spinner'
import Message from '../Message/Message'
import CountryItem from '../CountryItem/CountryItem'
import { useCities } from '../../contexts/CitiesProvider'

const CountryList = () => {
	const { cities, isLoading } = useCities()

	if (isLoading) return <Spinner />

	if (!cities.length)
		return (
			<Message message='Add your frist city by clicking on a city on the map' />
		)

	const countries = cities.reduce<{ country: string; emoji: string }[]>(
		(accum, item) => {
			if (!accum.map(el => el.country).includes(item.country)) {
				return [...accum, { country: item.country, emoji: item.emoji }]
			} else {
				return accum
			}
		},
		[]
	)

	return (
		<ul className={styles.countryList}>
			{countries.map((country, index) => (
				<CountryItem country={country} key={index} />
			))}
		</ul>
	)
}

export default CountryList
