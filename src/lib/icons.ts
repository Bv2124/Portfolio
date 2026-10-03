// Single source of truth mapping content `iconName` strings to lucide components.
// Add a new icon here and it becomes available to the content (the schema reads these keys).
import {
  Braces, Cloud, Database, GitMerge, HeartPulse, Layers, Monitor, Plug,
  Server, Smartphone, TestTube2, UserCheck, Users, Wrench,
  type LucideIcon,
} from 'lucide-react'

export const ICONS = {
  Braces, Cloud, Database, GitMerge, HeartPulse, Layers, Monitor, Plug,
  Server, Smartphone, TestTube2, UserCheck, Users, Wrench,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

// Returns the component for a name, or null if unknown (callers guard on null).
export function getIcon(name: string): LucideIcon | null {
  return (ICONS as Record<string, LucideIcon>)[name] ?? null
}
