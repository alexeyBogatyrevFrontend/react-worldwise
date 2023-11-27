import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App'
import Login from './pages/Login/Login'
import Product from './pages/Product/Product'
import Pricing from './pages/Pricing'
import PageNotFound from './pages/PageNotFound'
import AppLayout from './pages/AppLayout/AppLayout'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
	{
		path: '/product',
		element: <Product />,
	},
	{
		path: '/pricing',
		element: <Pricing />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/app',
		element: <AppLayout />,
		children: [
			{
				index: true,
				element: <p>asdfasdf</p>,
			},
			{
				path: 'cities',
				element: <p>cities</p>,
			},
			{
				path: 'countries',
				element: <p>countries</p>,
			},
			{
				path: 'form',
				element: <p>form</p>,
			},
		],
	},
	{
		path: '*',
		element: <PageNotFound />,
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
