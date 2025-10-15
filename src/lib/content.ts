import { apiCall } from '@/lib/api'

export type SettingsMap = Record<string, any>

export async function fetchSettingsMap(): Promise<SettingsMap> {
  try {
    const resp = await apiCall('/api/content/settings')
    if (!resp.ok) return {}
    const data = await resp.json()
    const map: SettingsMap = {}
    for (const s of data.settings || []) {
      try {
        map[s.key] = JSON.parse(s.value)
      } catch {
        map[s.key] = s.value
      }
    }
    return map
  } catch {
    return {}
  }
}