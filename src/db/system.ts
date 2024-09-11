import db from "../../db"
import { accounts, systems } from "../../db/schema"
import type { DiscordAccount } from "../types/account"
import type { AtlasSystem, AtlasSystemInternal } from "../types/system"
import { eq } from "drizzle-orm"

export async function getSystemByAccount(id: string): Promise<AtlasSystemInternal | null> {
	let system: AtlasSystemInternal | null = null

	const data = await db
		.select()
		.from(systems)
		.innerJoin(accounts, eq(accounts.system, systems.id))
		.where(eq(accounts.id, id))
	if (data && data[0]) system = data[0].systems

	let account: DiscordAccount[] | undefined

	if (system && system.id) {
		account = await db.select().from(accounts).where(eq(accounts.system, system.id))
	}

	if (system) return { ...system, accounts: account }
	else return null
}

export async function createSystem(
	id: string,
	data: AtlasSystem
): Promise<AtlasSystemInternal | null> {
	const system: AtlasSystemInternal[] = await db.insert(systems).values(data).returning()

	let account: DiscordAccount[] | null = null
	account = await db.select().from(accounts).where(eq(accounts.id, id))

	if (!account || !account[0]) {
		await db.insert(accounts).values({
			id: id,
			system: system[0].id,
		})
	} else {
		await db
			.update(accounts)
			.set({
				system: system[0].id,
			})
			.where(eq(accounts.id, id))
	}

	if (system && system[0]) return { ...system[0], accounts: account }
	else return null
}

export async function deleteSystemById(id: number) {
	await db
		.update(accounts)
		.set({
			system: null,
		})
		.where(eq(accounts.system, id))

	await db.delete(systems).where(eq(systems.id, id))
}

export async function updateSystemById(id: number, data: AtlasSystem) {
	const patch = data
	Object.keys(data).forEach(
		(key) => data[key as keyof AtlasSystem] === undefined && delete data[key as keyof AtlasSystem]
	)

	const system: AtlasSystemInternal[] = await db
		.update(systems)
		.set(patch)
		.where(eq(systems.id, id))
		.returning()

	let account: DiscordAccount[] | undefined
	if (system && system[0]) {
		account = await db.select().from(accounts).where(eq(accounts.system, system[0].id))
	}

	if (system && system[0]) return { ...system[0], accounts: account }
	else return null
}
