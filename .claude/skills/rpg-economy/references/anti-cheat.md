# Anti-trampas

| Riesgo                                 | Mitigación                                                                        |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| Cliente modificado envía XP            | El cliente solo envía `quest_id`; el servidor calcula la recompensa.              |
| Completar la misma misión muchas veces | `(source, source_id)` único; el periodo va dentro del `source_id`.                |
| Marcar todo como «épica»               | Límites por dificultad y día (`docs/economy.md`), validados en servidor.          |
| Cambiar la hora del teléfono           | `now()` del servidor + zona horaria guardada en el perfil.                        |
| Editar una misión ya completada        | La edición no re-otorga; la recompensa se congela al completar.                   |
| Cuentas falsas para el ranking         | Ranking opt-in, tope de XP auto-reportada, outliers marcados (`rpg-leaderboard`). |
| Duplicar compras en la tienda          | Una transacción: comprobar saldo, descontar e insertar item juntos.               |
