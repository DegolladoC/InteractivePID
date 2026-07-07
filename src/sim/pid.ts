export interface PidGains {
  kp: number
  ki: number
  kd: number
}

export interface PidOptions {
  antiWindup?: boolean
  integralLimit?: number
}

const DEFAULT_INTEGRAL_LIMIT = 10

function clamp(value: number, limit: number): number {
  if (value > limit) return limit
  if (value < -limit) return -limit
  return value
}

// Derivativo sobre la medición (-dy/dt), no sobre el error: evita el "derivative
// kick" que produciría un pico enorme en t=0, cuando el setpoint salta de golpe
// (respuesta al escalón) y de/dt heredaría ese salto instantáneo.
export function createPidController(gains: PidGains, options: PidOptions = {}) {
  const integralLimit = options.integralLimit ?? DEFAULT_INTEGRAL_LIMIT
  let integral = 0
  let prevMeasurement: number | null = null

  return {
    reset(): void {
      integral = 0
      prevMeasurement = null
    },
    step(setpoint: number, measurement: number, dt: number): number {
      const error = setpoint - measurement

      integral += error * dt
      if (options.antiWindup) {
        integral = clamp(integral, integralLimit)
      }

      const measurementRate = prevMeasurement === null ? 0 : (measurement - prevMeasurement) / dt
      prevMeasurement = measurement

      return gains.kp * error + gains.ki * integral - gains.kd * measurementRate
    },
  }
}
