# Equipo y rarezas

## Slots

`head`, `chest`, `legs`, `cape`, `weapon`, `accessory_1`, `accessory_2` — un item por slot.

## Rarezas

| Rareza    | Color token        | Bonus máximo por item | Origen                   |
| --------- | ------------------ | --------------------- | ------------------------ |
| common    | `rarity.common`    | cosmético             | tienda                   |
| uncommon  | `rarity.uncommon`  | +2 %                  | tienda, cofres semanales |
| rare      | `rarity.rare`      | +5 %                  | tienda, logros           |
| epic      | `rarity.epic`      | +8 %                  | logros, temporadas       |
| legendary | `rarity.legendary` | +10 %                 | recompensa de temporada  |

Precios: `docs/economy.md`. Colores: `src/constants/theme.ts` (skill `mobile-design`).

## Forma de un item (seed / JSON)

```json
{
  "slug": "capa-madrugador",
  "name": "Capa del Madrugador",
  "slot": "cape",
  "rarity": "rare",
  "bonus": { "type": "xp_pct", "value": 0.05, "condition": { "before_hour": 8 } },
  "tradable": false
}
```

Tipos de bonus permitidos: `xp_pct` (global), `attr_xp_pct` (requiere `attribute`), `streak_shield` (protege 1 día de racha por semana), `cosmetic`.
Nuevo tipo de bonus → actualizar esta lista + la función de servidor + tests.
