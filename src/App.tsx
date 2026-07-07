import { useMemo } from 'react'
import { rk4Step } from './sim/integrator'
import { createDcMotorPlant } from './sim/plants'
import { ResponseChart } from './components/ResponseChart'

const DT = 0.01
const DURATION_S = 10

function simulateOpenLoopStepResponse() {
  const plant = createDcMotorPlant()
  const steps = Math.round(DURATION_S / DT)

  const time: number[] = []
  const output: number[] = []
  let state = plant.initialState

  for (let i = 0; i <= steps; i++) {
    time.push(i * DT)
    output.push(plant.output(state))
    state = rk4Step(plant.derivative, state, 1, DT)
  }

  return { time, output }
}

function App() {
  const { time, output } = useMemo(() => simulateOpenLoopStepResponse(), [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Simulador Interactivo de Sintonización PID
      </h1>
      <p className="mt-1 text-slate-600">
        Día 1 — respuesta al escalón en lazo abierto de la planta Motor DC.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <ResponseChart time={time} output={output} />
      </div>
    </div>
  )
}

export default App
