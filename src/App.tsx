import Homepage from './pages/HomePage/Homepage'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Product from './pages/Product/Product'
import Pricing from './pages/Pricing'
import Login from './pages/Login/Login'
import AppLayout from './pages/AppLayout/AppLayout'
import PageNotFound from './pages/PageNotFound'
import CityList from './components/CityList/CityList'
import CountryList from './components/CountryList/CountryList'
import City from './components/City/City'
import Form from './components/Form/Form'
import { CitiesProvider } from './contexts/CitiesProvider'
import { AuthProvider } from './contexts/FakeAuthContext'
import ProtectedRoute from './pages/ProtectedRoute'

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
	return (
		<AuthProvider>
			<CitiesProvider>
				<BrowserRouter>
					<Routes>
						<Route index element={<Homepage />} />
						<Route path='/product' element={<Product />} />
						<Route path='/pricing' element={<Pricing />} />
						<Route path='/login' element={<Login />} />
						<Route
							path='/app'
							element={
								<ProtectedRoute>
									<AppLayout />{' '}
								</ProtectedRoute>
							}
						>
							<Route index element={<Navigate replace to='cities' />} />
							<Route path='cities' element={<CityList />} />
							<Route path='cities/:id' element={<City />} />
							<Route path='countries' element={<CountryList />} />
							<Route path='form' element={<Form />} />
						</Route>
						<Route path='*' element={<PageNotFound />} />
					</Routes>
				</BrowserRouter>
			</CitiesProvider>
		</AuthProvider>
	)
}

export default App
