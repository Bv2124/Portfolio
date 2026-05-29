// Single source of truth mapping JSON `iconName` strings to lucide components.
// Add a new icon here and it becomes available to portfolio.json instantly.
import {
  Monitor, Palette, Box, Atom, Globe, Wind, Flame, Shield,
  Smartphone, Compass, Apple, Terminal, Code2, Layers, Database,
  Server, Code, Zap, Mail, Phone, Github, Linkedin, Feather,
  Braces, Cloud, Cpu,
} from 'lucide-react'

export const ICONS = {
  Monitor, Palette, Box, Atom, Globe, Wind, Flame, Shield,
  Smartphone, Compass, Apple, Terminal, Code2, Layers, Database,
  Server, Code, Zap, Mail, Phone, Github, Linkedin, Feather,
  Braces, Cloud, Cpu,
}

// Returns the component for a name, or null if unknown (callers guard on null).
export function getIcon(name) {
  return ICONS[name] ?? null
}
