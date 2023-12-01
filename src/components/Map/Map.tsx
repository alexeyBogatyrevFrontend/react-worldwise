import { useNavigate } from 'react-router-dom'
import styles from './Map.module.css'
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
	useMapEvents,
} from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { FC, useEffect, useState } from 'react'
import { useCities } from '../../contexts/CitiesProvider'
import { useGeolocation } from '../../hooks/useGeolocation'
import Button from '../Button/Button'
import useUrlPosition from '../../hooks/useUrlPosition'

const Map = () => {
	const { cities } = useCities()
	const [mapPosition, setMapPosition] = useState([40, 0])
	const [lat, lng] = useUrlPosition()
	const {
		isLoading: isLoadingPosition,
		position: geolocationPosition,
		getPosition,
	} = useGeolocation()

	useEffect(() => {
		if (lat && lng) setMapPosition([+lat, +lng])
	}, [lat, lng])

	useEffect(() => {
		if (geolocationPosition)
			setMapPosition([geolocationPosition.lat, geolocationPosition.lng])
	}, [geolocationPosition])

	return (
		<div className={styles.mapContainer}>
			{!geolocationPosition && (
				<Button type='position' onClick={getPosition}>
					{isLoadingPosition ? 'Loading...' : 'Use your position'}
				</Button>
			)}
			<MapContainer
				// @ts-expect-error: something wrong with library
				center={mapPosition}
				zoom={10}
				scrollWheelZoom={true}
				className={styles.map}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
				/>
				{cities.map(city => (
					<Marker
						key={city.id}
						position={[city.position.lat, city.position.lng]}
					>
						<Popup>
							<span>{city.emoji}</span>
							<span>{city.cityName}</span>
						</Popup>
					</Marker>
				))}
				<ChangeCenter
					// @ts-expect-error: something wrong with library
					position={mapPosition}
				/>
				<DetectClick />
			</MapContainer>
		</div>
	)
}

type ChangeCenterProps = {
	position: [number, number]
}

const ChangeCenter: FC<ChangeCenterProps> = ({ position }) => {
	const map = useMap()
	map.setView(position)

	return null
}

const DetectClick = () => {
	const navigate = useNavigate()

	useMapEvents({
		click: (e: LeafletMouseEvent) =>
			navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
	})

	return null
}

export default Map
