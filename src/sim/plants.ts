import type { Derivative } from './integrator'

export interface Plant {
  name: string
  initialState: number[]
  derivative: Derivative<number[]>
  output: (state: number[]) => number
}

export interface DcMotorParams {
  gain: number
  timeConstant: number
}

export const DEFAULT_DC_MOTOR_PARAMS: DcMotorParams = {
  gain: 1,
  timeConstant: 1,
}

// G(s) = K / (tau*s + 1) -> tau*dy/dt = -y + K*u
export function createDcMotorPlant(params: DcMotorParams = DEFAULT_DC_MOTOR_PARAMS): Plant {
  const { gain, timeConstant } = params

  const derivative: Derivative<number[]> = ([y], u) => [(-y + gain * u) / timeConstant]

  return {
    name: 'Motor DC',
    initialState: [0],
    derivative,
    output: ([y]) => y,
  }
}
