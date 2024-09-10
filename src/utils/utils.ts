export function isUrl(url: string) {
	try {
		new URL(url)
	} catch (e) {
		return false
	}
	return true
}

export function nullIfEmpty(value: string | null | undefined) {
	if (value && value.length === 0) return null
	else return value
}
