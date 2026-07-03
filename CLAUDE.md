# CLAUDE.md — Simulador Interactivo de Sintonización PID

Instrucciones para Claude al trabajar en este repo.

## Contexto del proyecto

Plataforma web frontend-only que simula el control PID de varias plantas y muestra la
respuesta al escalón + métricas en vivo. El usuario (DDegollado) ya construyó antes una demo
de PID (control de altitud de dron); este proyecto la generaliza a herramienta educativa.
Público: alguien aprendiendo control, que ajusta ganancias con sliders sin tocar código.

## Stack y convenciones

- **Vite + React + TypeScript**. Componentes funcionales con hooks, nada de clases.
- **Tailwind** para estilos. Evitar CSS suelto salvo lo imprescindible.
- **uPlot** para las gráficas (prioridad: rendimiento en actualización continua). Si se pide
  simplicidad sobre rendimiento, Recharts es aceptable, pero no mezclar ambas.
- Tipar todo. Nada de `any` salvo justificación explícita.
- Comentarios y nombres de UI en español; nombres de variables/funciones en inglés.

## Arquitectura

```
src/
  sim/
    plants.ts        # definiciones de plantas (motor, temperatura, tanque)
    pid.ts           # controlador PID (con anti-windup opcional)
    integrator.ts    # RK4 a paso fijo
    metrics.ts       # overshoot, rise/settling time, steady-state error
  components/
    PlantSelector.tsx
    GainSliders.tsx
    ResponseChart.tsx
    MetricsPanel.tsx
  App.tsx
```

Separar SIEMPRE la lógica de simulación (`src/sim/`) de la UI. La simulación debe poder
correr en un test de Node sin React.

## Detalles técnicos que no se deben romper

- **Paso de integración fijo `dt = 0.01 s`.** No usar dt variable; rompe la comparación de métricas.
- El lazo cerrado es: `e = setpoint - y` → `u = PID(e)` → `y = plant.step(u, dt)`. Respetar este orden.
- El término integral debe acumularse con anti-windup (clamp) cuando esté habilitado, para
  evitar que las curvas se disparen con Ki alto.
- El término derivativo se calcula sobre el error (o sobre la salida si se activa "derivative on
  measurement"); documentar cuál se usa.
- Re-simular en cada cambio de slider debe ser instantáneo. Si una simulación completa (p. ej.
  10 s → 1000 puntos) tarda, memoizar y evitar recalcular plantas no seleccionadas.

## Cálculo de métricas (definiciones a usar)

- **Overshoot %** = `(pico - setpoint) / setpoint * 100`.
- **Rise time** = tiempo de 10% a 90% del setpoint.
- **Settling time** = primer instante tras el cual la salida se queda dentro de ±2% del setpoint.
- **Steady-state error** = `setpoint - y(final)`.

Estas definiciones deben quedar en `metrics.ts` con tests.

## Comandos

```bash
npm run dev       # desarrollo
npm run build     # producción -> /dist
npm run preview   # previsualizar build
```

## Qué NO hacer

- No agregar backend ni llamadas de red: es 100% cliente.
- No usar localStorage/sessionStorage si el código se pega en un artifact de Claude.ai (falla ahí);
  usar estado de React. En repo local sí funciona.
- No meter una librería de control pesada (control.js, etc.) por un integrador que son 20 líneas.
- No cambiar el `dt` para "arreglar" una curva rara; el problema casi siempre es el anti-windup
  o el signo del error.
