// Single source of truth mapping JSON `iconName` strings to lucide components.
// Add a new icon here and it becomes available to the content instantly.
import {
  Monitor, Palette, Box, Atom, Globe, Wind, Flame, Shield,
  Smartphone, Compass, Apple, Terminal, Code2, Layers, Database,
  Server, Code, Zap, Braces, Cloud,
  type LucideIcon,
} from 'lucide-react'

export const ICONS = {
  Monitor, Palette, Box, Atom, Globe, Wind, Flame, Shield,
  Smartphone, Compass, Apple, Terminal, Code2, Layers, Database,
  Server, Code, Zap, Braces, Cloud,
} satisfies Record<string, LucideIcon>

export type IconName = keyof typeof ICONS

// Returns the component for a name, or null if unknown (callers guard on null).
export function getIcon(name: string): LucideIcon | null {
  return (ICONS as Record<string, LucideIcon>)[name] ?? null
}
