# Decisiones

Formato: `AAAA-MM-DD — decisión — motivo`

- 2026-11-07 — Expo + Expo Router + TypeScript — un código para Android, iOS y web; builds iOS en la nube (no hay Mac).
- 2026-11-07 — Recompensas calculadas en servidor — evita trampas en economía y rankings.
- 2026-11-07 — jest-expo + Testing Library; Maestro pospuesto — mínimo necesario para el MVP.
- 2026-11-07 — CLAUDE.md importa AGENTS.md — una sola fuente para reglas de Expo.
- 2026-11-07 — Plugin oficial de Expo (v1.13.9) con telemetría apagada (`EXPO_SKILLS_TELEMETRY=0`) y comando `submit-expo-feedback` bloqueado — skills oficiales actualizadas por Expo.
- 2026-11-07 — security-guidance solo con patrones (`ENABLE_CODE_SECURITY_REVIEW=0`) — la revisión LLM en cada turno costaba ~USD 0.19; revisiones profundas con `/security-review` bajo demanda.
- 2026-11-07 — Sin plugin de Supabase: su MCP no es de solo lectura ni está limitado a un proyecto. Se configurará `.mcp.json` con `read_only=true&project_ref=…` en la fase de backend.
- 2026-11-07 — 8 skills + 6 subagentes propios; números solo en docs/economy.md y auditoría con `npm run audit:context` — contexto fijo ≈ 1.9k tokens sin plugins.
- 2026-11-07 — CI en GitHub Actions (acciones fijadas por SHA) + Dependabot sin paquetes del SDK de Expo — esos se actualizan juntos con `npx expo install --fix`.
