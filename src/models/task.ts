import { UserSession } from '@videopass/ctms-model'

export interface Task {
	name: string
	init(client: any): Promise<void>
	process(userSession: UserSession, ...args: any[]): Promise<void>
}
