import {
	FC,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react'
import { CityType } from '../App'

const BASE_URL = 'http://localhost:8000'

type CitiesProviderProps = {
	children: ReactNode
}

type CitiesContextTypes = {
	cities: CityType[]
	isLoading: boolean
}

const CitiesContext = createContext<CitiesContextTypes>({
	cities: [],
	isLoading: false,
})

const CitiesProvider: FC<CitiesProviderProps> = ({ children }) => {
	const [cities, setCities] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true)
				const res = await fetch(`${BASE_URL}/cities`)
				const data = await res.json()

				setCities(data)
			} catch (error) {
				alert('There was an error loading data...')
			} finally {
				setIsLoading(false)
			}
		}
		fetchData()
	}, [])
	return (
		<CitiesContext.Provider value={{ cities, isLoading }}>
			{children}
		</CitiesContext.Provider>
	)
}

const useCities = () => {
	const context = useContext(CitiesContext)
	if (context === undefined)
		throw new Error('CitiesContext was used outside the CitiesProvider')

	return context
}

export { CitiesProvider, useCities }
