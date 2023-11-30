import { useState } from 'react'

type Coordinates = {
	lat: number
	lng: number
}

export const useGeolocation = (defaultPosition: Coordinates | null = null) => {
	const [isLoading, setIsLoading] = useState(false)
	const [position, setPosition] = useState<Coordinates | null>(defaultPosition)
	const [error, setError] = useState<null | string>(null)

	function getPosition() {
		if (!navigator.geolocation)
			return setError('Your browser does not support geolocation')

		setIsLoading(true)
		navigator.geolocation.getCurrentPosition(
			pos => {
				setPosition({
					lat: pos.coords.latitude,
					lng: pos.coords.longitude,
				})
				setIsLoading(false)
			},
			error => {
				setError(error.message)
				setIsLoading(false)
			}
		)
	}

	return { isLoading, position, error, getPosition }
}
