import { and, eq, ilike, or } from "drizzle-orm"
import db from "../../db"
import { aliases, members } from "../../db/schema"
import type {
	AtlasMember,
	AtlasMemberFull,
	AtlasMemberPartial,
	MemberAlias,
	MemberAliasFull,
} from "../types/member"

export async function getMemberByName(system: number, name: string): Promise<AtlasMember | null> {
	let member: AtlasMember | null = null

	const data = await db
		.select()
		.from(members)
		.leftJoin(aliases, eq(aliases.member, members.id))
		.where(
			and(eq(members.system, system), or(ilike(members.name, name), ilike(aliases.name, name)))
		)

	if (data && data[0]) member = data[0].members
	if (!member) return null

	let alias: MemberAlias[] = []
	if (member.id) alias = await db.select().from(aliases).where(eq(aliases.member, member.id))

	return { ...member, aliases: alias.length > 0 ? alias : undefined }
}

export async function createMember(data: AtlasMemberFull): Promise<AtlasMember | null> {
	let member: AtlasMember | null = null
	const patch: AtlasMember[] = await db.insert(members).values(data).returning()

	if (patch && patch[0]) member = patch[0]
	if (!member) return null

	let aliasList: MemberAlias[] = []
	if (data.aliases)
		for (const a of data.aliases) {
			const alias = await db.insert(aliases).values(a)
			if (alias && alias[0]) aliasList.push(alias[0])
		}

	return { ...member, aliases: aliasList.length > 0 ? aliasList : undefined }
}

export async function deleteMemberById(id: number) {
	await db.transaction(async (tx) => {
		await tx.delete(aliases).where(eq(aliases.member, id))
		await tx.delete(members).where(eq(members.id, id))
	})
}

export async function updateMemberByid(id: number, data: AtlasMember): Promise<AtlasMember | null> {
	const patch = data
	Object.keys(data).forEach(
		(key) => data[key as keyof AtlasMember] === undefined && delete data[key as keyof AtlasMember]
	)

	const member: AtlasMember[] = await db
		.update(members)
		.set(patch)
		.where(eq(members.id, id))
		.returning()

	let alias: MemberAlias[] | undefined = undefined
	if (member && member[0]) {
		alias = await db.select().from(aliases).where(eq(aliases.member, id))
	}

	if (member && member[0]) return { ...member[0], aliases: alias }
	else return null
}

export async function clearMemberFieldsById(
	id: number,
	data: Array<keyof AtlasMemberPartial>
): Promise<AtlasMember | null> {
	const patch: Partial<Record<keyof AtlasMemberPartial, null>> = {}
	data.forEach((k) => (patch[k] = null))

	const member = await db.update(members).set(patch).where(eq(members.id, id)).returning()

	let alias: MemberAlias[] | undefined = undefined
	if (member && member[0]) {
		alias = await db.select().from(aliases).where(eq(aliases.member, id))
	}

	if (member && member[0]) return { ...member[0], aliases: alias }
	else return null
}

export async function addAlias(data: MemberAliasFull) {
	const alias = await db.insert(aliases).values(data).returning()

	if (alias && alias[0]) return alias[0]
}

export async function removeAliasById(id: number) {
	await db.delete(aliases).where(eq(aliases.id, id))
}
