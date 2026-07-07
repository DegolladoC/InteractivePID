export type Derivative<TState extends number[]> = (state: TState, u: number) => TState

function addScaled<TState extends number[]>(state: TState, delta: TState, scale: number): TState {
  return state.map((value, i) => value + delta[i] * scale) as TState
}

export function rk4Step<TState extends number[]>(
  derivative: Derivative<TState>,
  state: TState,
  u: number,
  dt: number,
): TState {
  const k1 = derivative(state, u)
  const k2 = derivative(addScaled(state, k1, dt / 2), u)
  const k3 = derivative(addScaled(state, k2, dt / 2), u)
  const k4 = derivative(addScaled(state, k3, dt), u)

  return state.map(
    (value, i) => value + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]),
  ) as TState
}
