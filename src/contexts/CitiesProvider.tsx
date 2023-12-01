import {
	FC,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useReducer,
} from 'react'
import { CityType } from '../App'

const BASE_URL = 'http://localhost:8000'

type CitiesProviderProps = {
	children: ReactNode
}

type currentCityType = {
	id: number
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
		id: 0,
		cityName: '',
		emoji: '',
		date: '',
		notes: '',
	},

	getCity: async (id: string) => {
		console.log(id)
	},
	createCity: async (newCity: CityType) => {
		console.log(newCity)
	},
	deleteCity: async (id: number) => {
		console.log(id)
	},
})

const initialState: StateType = {
	cities: [],
	isLoading: false,
	currentCity: { id: 0, cityName: '', emoji: '', date: '', notes: '' },
	error: '',
}

type StateType = {
	cities: CityType[]
	isLoading: boolean
	currentCity: currentCityType
	error: string
}

type ActionType =
	| { type: 'loading' }
	| { type: 'cities/loaded'; payload: CityType[] }
	| { type: 'city/loaded'; payload: currentCityType }
	| { type: 'city/created'; payload: CityType }
	| { type: 'city/deleted'; payload: number }
	| { type: 'rejected'; payload: string }

const reducer = (state: StateType, action: ActionType): StateType => {
	switch (action.type) {
		case 'loading':
			return { ...state, isLoading: true }
		case 'cities/loaded':
			return { ...state, isLoading: false, cities: action.payload }
		case 'city/loaded':
			return { ...state, isLoading: false, currentCity: action.payload }
		case 'city/created':
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			}
		case 'city/deleted':
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter(city => city.id !== action.payload),
				currentCity: {
					id: 0,
					cityName: '',
					emoji: '',
					date: '',
					notes: '',
				},
			}
		case 'rejected':
			return { ...state, isLoading: false, error: action.payload }

		default:
			throw new Error('Unknown action type')
	}
}

const CitiesProvider: FC<CitiesProviderProps> = ({ children }) => {
	const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
		reducer,
		initialState
	)

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'loading' })

			try {
				const res = await fetch(`${BASE_URL}/cities`)
				const data = await res.json()

				dispatch({ type: 'cities/loaded', payload: data })
			} catch (error) {
				dispatch({
					type: 'rejected',
					payload: 'There was an error loading data...',
				})
			}
		}
		fetchData()
	}, [])

	const getCity = async (id: string) => {
		if (+id === +currentCity.id) return

		dispatch({ type: 'loading' })
		try {
			const res = await fetch(`${BASE_URL}/cities/${id}`)
			const data = await res.json()

			dispatch({ type: 'city/loaded', payload: data })
		} catch (error) {
			dispatch({
				type: 'rejected',
				payload: 'There was an error loading data...',
			})
		}
	}

	const createCity = async (newCity: CityType) => {
		dispatch({ type: 'loading' })
		try {
			const res = await fetch(`${BASE_URL}/cities`, {
				method: 'POST',
				body: JSON.stringify(newCity),
				headers: {
					'Content-Type': 'application/json',
				},
			})
			const data = await res.json()

			dispatch({ type: 'city/created', payload: data })
		} catch (error) {
			dispatch({
				type: 'rejected',
				payload: 'There was an error creating city.',
			})
		}
	}

	const deleteCity = async (id: number) => {
		dispatch({ type: 'loading' })
		try {
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: 'DELETE',
			})

			dispatch({ type: 'city/deleted', payload: id })
		} catch (error) {
			dispatch({
				type: 'rejected',
				payload: 'There was an error deleting city.',
			})
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
