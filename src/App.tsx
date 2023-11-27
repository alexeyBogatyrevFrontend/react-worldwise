import { useEffect, useState } from 'react'
import Homepage from './pages/HomePage/Homepage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Product from './pages/Product/Product'
import Pricing from './pages/Pricing'
import Login from './pages/Login/Login'
import AppLayout from './pages/AppLayout/AppLayout'
import PageNotFound from './pages/PageNotFound'
import CityList from './components/CityList/CityList'
import CountryList from './components/CountryList/CountryList'

const BASE_URL = 'http://localhost:8000'

export type CityType = {
	cityName: string
	country: string
	emoji: string
	date: string
	notes: string
	position: Position
	id: number
}

export type Position = {
	lat: number
	lng: number
}

const App = () => {
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
		<BrowserRouter>
			<Routes>
				<Route index element={<Homepage />} />
				<Route path='/product' element={<Product />} />
				<Route path='/pricing' element={<Pricing />} />
				<Route path='/login' element={<Login />} />
				<Route path='/app' element={<AppLayout />}>
					<Route
						index
						element={<CityList cities={cities} isLoading={isLoading} />}
					/>
					<Route
						path='cities'
						element={<CityList cities={cities} isLoading={isLoading} />}
					/>
					<Route
						path='countries'
						element={<CountryList cities={cities} isLoading={isLoading} />}
					/>
					<Route path='form' element={<p>form</p>} />
				</Route>
				<Route path='*' element={<PageNotFound />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
