import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App'
import Login from './pages/Login'
import Product from './pages/Product'
import Pricing from './pages/Pricing'
import PageNotFound from './pages/PageNotFound'

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
		path: '*',
		element: <PageNotFound />,
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
