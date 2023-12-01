import { FC, ReactNode, useEffect } from 'react'
import { useAuth } from '../contexts/FakeAuthContext'
import { useNavigate } from 'react-router-dom'

type ProtectedRouteProps = {
	children: ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (!isAuthenticated) navigate('/')
	}, [isAuthenticated, navigate])

	return children
}

export default ProtectedRoute
