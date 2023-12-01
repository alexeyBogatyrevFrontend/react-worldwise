import { FC, ReactNode, createContext, useContext, useReducer } from 'react'

type User = {
	name: string
	email: string
	password: string
	avatar: string
}

type AuthState = {
	user: User | null
	isAuthenticated: boolean
}

type AuthAction = { type: 'login'; payload: User } | { type: 'logout' }

type AuthProviderProps = {
	children: ReactNode
}

const AuthContext = createContext<
	| {
			user: User | null
			isAuthenticated: boolean
			login: (email: string, password: string) => void
			logout: () => void
	  }
	| undefined
>(undefined)

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
}

const reducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case 'login':
			return { ...state, user: action.payload, isAuthenticated: true }
		case 'logout':
			return { ...state, user: null, isAuthenticated: false }
		default:
			throw new Error('Unknown action')
	}
}

const FAKE_USER: User = {
	name: 'Alexey',
	email: 'alexey@example.com',
	password: 'qwerty',
	avatar: 'https://i.pravatar.cc/100?u=zz',
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	const [state, dispatch] = useReducer(reducer, initialState)

	const login = (email: string, password: string): void => {
		if (email === FAKE_USER.email && password === FAKE_USER.password) {
			dispatch({ type: 'login', payload: FAKE_USER })
		}
	}

	const logout = (): void => {
		dispatch({ type: 'logout' })
	}

	return (
		<AuthContext.Provider value={{ ...state, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

const useAuth = () => {
	const context = useContext(AuthContext)

	if (context === undefined) {
		throw new Error('AuthContext was used outside AuthProvider')
	}

	return context
}

export { AuthProvider, useAuth }
