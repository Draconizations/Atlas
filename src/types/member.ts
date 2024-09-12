export interface AtlasMemberPartial {
	color?: string | null
	icon?: string | null
	description?: string | null
	displayName?: string | null
	pronouns?: string | null
}

export interface AtlasMember extends AtlasMemberPartial {
	id?: number
	name?: string
	aliases?: MemberAlias[]
	system?: number
	created?: Date
}

export interface AtlasMemberFull extends AtlasMember {
	name: string
	system: number
	aliases: MemberAliasFull[]
}

export interface MemberAlias {
	member?: number
	system?: number
	name?: string
	id?: number
}

export interface MemberAliasFull extends MemberAlias {
	member: number
	system: number
	name: string
}
