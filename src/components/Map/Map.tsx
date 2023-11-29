import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
	useMapEvents,
} from 'react-leaflet'
import { useEffect, useState } from 'react'
import { useCities } from '../../contexts/CitiesProvider'

const Map = () => {
	const { cities } = useCities()

	const [searchParams] = useSearchParams()
	const lat = searchParams.get('lat')
	const lng = searchParams.get('lng')
	const [mapPosition, setMapPosition] = useState([40, 0])

	useEffect(() => {
		if (lat && lng) setMapPosition([lat, lng])
	}, [lat, lng])

	return (
		<div className={styles.mapContainer}>
			<MapContainer
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
				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	)
}

const ChangeCenter = ({ position }) => {
	const map = useMap()
	map.setView(position)

	return null
}

const DetectClick = () => {
	const navigate = useNavigate()

	useMapEvents({
		click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
	})

	return null
}

export default Map
