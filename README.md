# Proyecto 3 — Simulador Interactivo de Sintonización PID

Plataforma web educativa donde eliges una **planta** (motor DC, temperatura, tanque de agua),
ajustas las ganancias **Kp / Ki / Kd** con sliders y ves en vivo la respuesta al escalón,
junto con las métricas clave: overshoot, tiempo de subida, tiempo de establecimiento y error
en estado estacionario.

Es la evolución natural de tu demo de PID: pasa de "un ejemplo" a "una herramienta".

---

## Objetivo

Que cualquiera entienda intuitivamente qué hace cada término del PID moviendo un slider y
viendo la curva reaccionar en tiempo real, sin tocar código.

## Stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Build | Vite + React + TypeScript | Rápido, tú ya te mueves bien en React |
| Estilos | Tailwind CSS | Prototipado veloz |
| Gráficas | uPlot (o Recharts si prefieres simplicidad) | uPlot rinde mejor para actualización continua |
| Matemáticas | Integrador propio (RK4) | Simular la EDO de cada planta |

> No necesita backend. Es 100% frontend, se puede desplegar en GitHub Pages o Vercel.

## Cómo correr

```bash
npm create vite@latest pid-simulator -- --template react-ts
cd pid-simulator
npm install
npm install uplot
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

## Modelo de las plantas

Cada planta es una función de transferencia que simulamos discretizando con RK4 a paso fijo (dt = 0.01 s):

- **Motor DC** — sistema de 1er/2do orden: `G(s) = K / (τs + 1)`
- **Temperatura (horno)** — 1er orden con retardo: `G(s) = K·e^(-Ls) / (τs + 1)`
- **Tanque de agua** — integrador: `G(s) = K / s`

El lazo cerrado calcula el error `e = setpoint - salida`, aplica el PID
`u = Kp·e + Ki·∫e·dt + Kd·de/dt`, y alimenta la planta paso a paso.

## Features (orden de implementación)

1. Selector de planta + slider de setpoint.
2. Sliders Kp / Ki / Kd con valores numéricos editables.
3. Gráfica de respuesta al escalón (setpoint vs salida) que se re-simula al mover cualquier slider.
4. Panel de métricas calculadas: overshoot %, rise time, settling time (±2%), steady-state error.
5. Botón "reproducir en tiempo real" (anima la simulación en vez de mostrarla completa).
6. Presets ("mal sintonizado", "agresivo", "crítico amortiguado") para enseñar contrastes.
7. Anti-windup en el integrador (bonus, buen detalle técnico).

## Plan de la semana (este proyecto)

- **Día 1** — Setup del repo + RK4 + una planta (motor DC) graficada estática.
- **Día 2** — Lazo cerrado con PID + sliders funcionando y re-simulación.
- **Día 3** — Panel de métricas + las otras dos plantas. Igual que en Día 4, la
  **presentación visual de este panel queda bloqueada** hasta definir la marca
  personal del proyecto — la lógica y los cálculos sí se hacen, pero su acabado
  visual espera a esa identidad.
- **Día 4** — Modo tiempo real + presets + deploy. El **pulido visual queda bloqueado**
  hasta definir la marca personal del proyecto (paleta de colores + esencia visual) —
  esa identidad debe estar lista antes de continuar con el acabado de la UI.

## Marca personal (bloqueado)

La identidad visual (paleta de colores + esencia) de la que dependen el pulido de
Día 3, Día 4 y el rediseño del Artifact de mapa del proyecto se va a basar en el
sitio/portafolio personal existente del autor.

- **Link del portafolio:** _pendiente — compartir antes de continuar con cualquier
  trabajo visual._

## Deploy

```bash
npm run build
# subir /dist a GitHub Pages o conectar el repo a Vercel
```

## Ideas de expansión

- Root locus o diagrama de Bode de la planta seleccionada.
- Perturbación tipo escalón a mitad de simulación (ver rechazo de disturbios).
- Ruido de sensor + filtro derivativo.
