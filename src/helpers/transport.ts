import { CtmsError } from '@videopass/ctms-model'
import { log } from '@videopass/services'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import * as https from 'https'

const httpsAgent = new https.Agent({ rejectUnauthorized: false })
let headers = {}
headers['Content-Type'] = 'application/hal+json'
headers['Accept'] = 'application/hal+json'
headers['Cache-Control'] = 'no-cache'
headers['Expires'] = 0

axios.defaults.timeout = 60000
axios.defaults.headers.common = headers
axios.defaults.httpsAgent = httpsAgent

axios.interceptors.request.use(
	(request) => {
		let data = ''
		if (request.data) data = `${JSON.stringify(request.data).substr(0, 150)}`

		return request
	},
	(error: AxiosError) => {
		const statusText = error.response?.statusText
		const logMetadata = { action: 'http request', ref: statusText, error }
		log.error(error, `${statusText} | ${error.message} | ${JSON.stringify(error.request)} | ${JSON.stringify(error.config)}`)
		return Promise.reject(error)
	}
)

axios.interceptors.response.use(
	(response) => {
		return response
	},
	(error: AxiosError) => {
		let data = JSON.stringify(error.response?.data || '')

		if ((error.response?.data as CtmsError).incident) {
			let ctmsError = error.response?.data as CtmsError
			data = ctmsError.message
		}

		const message = `${error.message} ${data}`
		const statusText = error.response?.statusText
		const logMetadata = { action: 'http response', ref: statusText, error }

		if (error.response?.status === 504) {
			log.error(error, (error as Error).message)
			log.error(error, JSON.stringify(error.config.url))
		}

		if (error.response?.status === 503) {
			log.error(error, `check nginx-service-proxy services`)
		}

		if (error.response?.status === 404) {
			log.warn(message)
			return Promise.reject(error)
		}

		if (error.response?.status === 400) {
			if (error.response.config.method === 'patch') {
				log.error(error, `check patch data. maybe some invalid data or object.`)
			}
			const incident = (error.response.data as CtmsError).incident
			logMetadata.ref = incident
			log.error(error, `check avid-upstream-core service logs with incident: ${incident} for details`)
		}

		if (error.response?.status === 409) {
			return Promise.reject(error)
		}

		log.error(error, message)
		return Promise.reject(error)
	}
)

export async function send(url: string, options: AxiosRequestConfig): Promise<AxiosResponse> {
	return await axios(url, options)
}
