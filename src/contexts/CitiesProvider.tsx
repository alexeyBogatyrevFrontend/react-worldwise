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

type currentCityType = {
	id: string
	cityName: string
	emoji: string
	date: string
	notes: string
}

type CitiesContextTypes = {
	cities: CityType[]
	isLoading: boolean
	currentCity: currentCityType
	getCity: (id: string) => Promise<void>
	createCity: (newCity: CityType) => Promise<void>
	deleteCity: (id: number) => Promise<void>
}

const CitiesContext = createContext<CitiesContextTypes>({
	cities: [],
	isLoading: false,
	currentCity: {
		id: '',
		cityName: '',
		emoji: '',
		date: '',
		notes: '',
	},
	getCity: async (id: string) => {},
	createCity: async (newCity: CityType) => {},
	deleteCity: async (id: number) => {},
})

const CitiesProvider: FC<CitiesProviderProps> = ({ children }) => {
	const [cities, setCities] = useState<CityType[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [currentCity, setCurrentCity] = useState<currentCityType>({
		id: '',
		cityName: '',
		emoji: '',
		date: '',
		notes: '',
	})

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

	const getCity = async (id: string) => {
		try {
			setIsLoading(true)
			const res = await fetch(`${BASE_URL}/cities/${id}`)
			const data = await res.json()

			setCurrentCity(data)
		} catch (error) {
			alert('There was an error loading data...')
		} finally {
			setIsLoading(false)
		}
	}

	const createCity = async (newCity: CityType) => {
		try {
			setIsLoading(true)
			const res = await fetch(`${BASE_URL}/cities`, {
				method: 'POST',
				body: JSON.stringify(newCity),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const data = await res.json()

			setCities(prev => [...prev, data])
		} catch (error) {
			alert('There was an error creating city.')
		} finally {
			setIsLoading(false)
		}
	}

	const deleteCity = async (id: number) => {
		try {
			setIsLoading(true)
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: 'DELETE',
			})

			setCities(prev => prev.filter(city => city.id !== id))
		} catch (error) {
			alert('There was an error deleting city.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				createCity,
				deleteCity,
			}}
		>
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
