// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { FormEvent, useEffect, useState } from 'react'

import styles from './Form.module.css'
import Button from '../Button/Button'
import BackButton from '../Button/BackButton'
import useUrlPosition from '../../hooks/useUrlPosition'
import Spinner from '../Spinner/Spinner'
import Message from '../Message/Message'
import DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import { useCities } from '../../contexts/CitiesProvider'
import { useNavigate } from 'react-router-dom'
import { convertToEmoji } from '../../utils/convertToEmoji'

const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'

export type GeocodeResponse = {
	latitude: number
	lookupSource: string
	longitude: number
	localityLanguageRequested: string
	continent: string
	continentCode: string
	countryName: string
	countryCode: string
	principalSubdivision: string
	principalSubdivisionCode: string
	city: string
	locality: string
	postcode: string
	plusCode: string
	localityInfo: LocalityInfo
}

export type LocalityInfo = {
	administrative: Administrative[]
	informative: Informative[]
}

export type Informative = {
	name: string
	description: string
	isoName?: string
	order: number
	isoCode?: string
	wikidataId?: string
	geonameId?: number
}

export type Administrative = {
	name: string
	description: string
	isoName?: string
	order: number
	adminLevel: number
	isoCode?: string
	wikidataId: string
	geonameId: number
}

function Form() {
	const { createCity, isLoading } = useCities()
	const [lat, lng] = useUrlPosition()
	const navigate = useNavigate()

	const [cityName, setCityName] = useState('')
	const [country, setCountry] = useState('')
	const [date, setDate] = useState(new Date())
	const [notes, setNotes] = useState('')
	const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false)
	const [emoji, setEmoji] = useState('')
	const [geocodingError, setGeocodingError] = useState('')

	useEffect(() => {
		const fetchCityData = async () => {
			if (!lat && !lng) return

			try {
				setIsLoadingGeocoding(true)
				setGeocodingError('')

				const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`)
				const data: GeocodeResponse = await res.json()

				if (!data.countryCode)
					throw new Error(
						"That doesn't seem to be a city. Click somewhere else 😊"
					)

				setCityName(data.city || data.locality || ' ')
				setCountry(data.countryName)
				setEmoji(convertToEmoji(data.countryCode))
			} catch (error: unknown) {
				if (error instanceof Error) {
					setGeocodingError(error.message)
				} else {
					console.error('Unexpected error:', error)
				}
			} finally {
				setIsLoadingGeocoding(false)
			}
		}
		fetchCityData()
	}, [lat, lng])

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!cityName || !date) return

		const newCity = {
			cityName,
			country,
			emoji,
			date,
			notes,
			position: { lat, lng },
		}

		await createCity(newCity)
		navigate('/app/cities')
	}

	if (isLoadingGeocoding) return <Spinner />

	if (!lat && !lng)
		return <Message message='Start by clicking somewhere on the map  ' />

	if (geocodingError) return <Message message={geocodingError} />

	return (
		<form
			className={`${styles.form} ${isLoading ? styles.loading : ''}`}
			onSubmit={submitHandler}
		>
			<div className={styles.row}>
				<label htmlFor='cityName'>City name </label>
				<input
					id='cityName'
					onChange={e => setCityName(e.target.value)}
					value={cityName}
				/>
				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor='date'>When did you go to {cityName}?</label>
				<DatePicker
					id='date'
					selected={date}
					onChange={(date: Date) => setDate(date)}
					dateFormat='dd/MM/yyyy'
				/>
			</div>

			<div className={styles.row}>
				<label htmlFor='notes'>Notes about your trip to {cityName}</label>
				<textarea
					id='notes'
					onChange={e => setNotes(e.target.value)}
					value={notes}
				/>
			</div>

			<div className={styles.buttons}>
				<Button type='primary'>Add</Button>
				<BackButton />
			</div>
		</form>
	)
}

export default Form
