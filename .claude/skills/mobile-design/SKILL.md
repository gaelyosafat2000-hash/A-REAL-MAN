---
name: mobile-design
description: Identidad visual y patrones de UI de juego para Life RPG (tokens de color/espaciado/tipografía, colores de rareza, barra de XP, animación de recompensa, subida de nivel, tarjetas de misión, inventario, accesibilidad). Úsala al diseñar o revisar cualquier pantalla o componente.
---

# Diseño móvil de Life RPG

Esta skill define **qué** se ve y por qué. Para **cómo** implementarlo con Expo (componentes nativos, animaciones, router), usa las skills `expo:*` del plugin oficial; no repitas aquí su contenido.

## Tokens (fuente única: `src/constants/theme.ts`, créalo si no existe)

- Tema oscuro primero; claro como alternativa. Cada color es un token, nunca un hex suelto en un componente.
- Espaciado en escala de 4: `4, 8, 12, 16, 24, 32`. Radios: `8` (tarjetas), `999` (chips).
- Tipografía: 5 tamaños máximo (`12, 14, 16, 20, 28`), respetando el tamaño de texto del sistema.
- Rarezas: `rarity.common | uncommon | rare | epic | legendary`. El color **siempre** va acompañado de icono o texto (no depender solo del color).

## Patrones de juego

| Patrón            | Regla                                                                             |
| ----------------- | --------------------------------------------------------------------------------- |
| Barra de XP       | Muestra `actual / necesaria` en texto además de la barra.                         |
| Recompensa        | Toast o pop-up ≤ 1.2 s, no bloquea; resume XP + oro + item.                       |
| Subida de nivel   | Modal celebratorio que se cierra con un toque; nunca en mitad de un formulario.   |
| Tarjeta de misión | Título, atributo (icono), dificultad, recompensa y acción principal a la derecha. |
| Inventario        | Rejilla virtualizada; borde/icono de rareza; mantener pulsado = detalle.          |
| Ranking           | Lista virtualizada; posición propia fija abajo.                                   |

## Accesibilidad (obligatorio)

- Objetivos táctiles ≥ 44 × 44 pt. Contraste de texto ≥ 4.5:1.
- `accessibilityLabel` en todo icono interactivo; `accessibilityRole` en botones.
- Respetar «reducir movimiento»: animaciones sustituidas por un fundido corto.
- Ningún dato solo por color; ningún texto dentro de imágenes.

## Procedimiento: nueva pantalla

1. Define el objetivo de la pantalla en una frase y la acción principal.
2. Reutiliza componentes de `src/components/`; crea uno nuevo solo si se usa 2+ veces.
3. Usa solo tokens de `theme.ts`. Si falta uno, añádelo allí.
4. Revisa la lista de accesibilidad y prueba con texto grande.
5. Test de componente (render + acción principal) con Testing Library.

## Ejemplo

Petición: «pantalla de recompensa al completar una misión».

- Toast inferior: `+50 XP · +10 oro`, icono del atributo, barra de XP animada hasta el nuevo valor.
- Con «reducir movimiento»: la barra salta al valor final y el toast aparece con fundido.
- Si sube de nivel → tras el toast, modal de nivel. Test: los textos aparecen y el modal se cierra.
