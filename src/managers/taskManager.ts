import { log } from "@videopass/services"

/**
 * Execute tasks in parallel
 * {@link https://dev.to/alemagio/node-parallel-execution-2h8p}
 * {@link https://medium.com/hackernoon/async-await-essentials-for-production-loops-control-flows-limits-23eb40f171bd}
 * @param tasks
 * @param maxParallelTasks default = 10
 */
export function execute(tasks: any[], maxParallelTasks: number = 10) {
	let start = Date.now()
	let completed = 0
	let running = 0
	let index = 0

	function run() {
		if (completed === tasks.length) {
			return log.debug(`${tasks.length} task(s) have been completed in: ${(Date.now() - start) / 1000} secs.`)
		}
		while (running < maxParallelTasks && index < tasks.length) {
			tasks[index++]().then(() => {
				running--, completed++
				run()
			})
			running++
		}
	}

	return run()
}
