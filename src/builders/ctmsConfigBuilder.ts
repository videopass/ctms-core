import { CtmsAuth, CtmsConfig } from '@videopass/ctms-model'
import { log } from '@videopass/services'
import * as env from 'env-var'

export function buildCtmsConfig(): CtmsConfig {
	const CLIENT_TOKEN: string = env.get('REACT_APP_CTMS_CLIENT_TOKEN').required().asString()
	const ctmsConfig = { clientToken: CLIENT_TOKEN }
	log.debug(`token: ${JSON.stringify(ctmsConfig)}`)
	return ctmsConfig
}

export function buildCtmsUrl(): string {
	const SERVER: string = env.get('REACT_APP_CTMS_SERVER').required().asString()
	const url = `https://${SERVER}`
	log.debug(`url: ${url}`)
	return url
}

export function buildCtmsAuth(): CtmsAuth {
	const GRANT_TYPE: string = env.get('REACT_APP_CTMS_GRANT_TYPE').required().asString()
	const USERNAME: string = env.get('REACT_APP_CTMS_USERNAME').required().asString()
	const PASSWORD: string = env.get('REACT_APP_CTMS_PASSWORD').required().asString()
	const SCOPE: string = env.get('REACT_APP_CTMS_SCOPE').required().asString()

	const ctmsAuth = { username: USERNAME, password: PASSWORD, grant_type: GRANT_TYPE, scope: SCOPE }
	log.debug(`authentication: ${JSON.stringify(ctmsAuth)}`)
	return ctmsAuth
}
