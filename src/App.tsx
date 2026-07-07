import { useMemo, useState } from 'react'
import { rk4Step } from './sim/integrator'
import { createDcMotorPlant } from './sim/plants'
import { createPidController, type PidGains } from './sim/pid'
import { ResponseChart } from './components/ResponseChart'
import { GainSliders } from './components/GainSliders'

const DT = 0.01
const DURATION_S = 10

function simulateClosedLoop(gains: PidGains, setpoint: number, antiWindup: boolean) {
  const plant = createDcMotorPlant()
  const pid = createPidController(gains, { antiWindup })
  const steps = Math.round(DURATION_S / DT)

  const time: number[] = []
  const setpointSeries: number[] = []
  const output: number[] = []
  let state = plant.initialState

  for (let i = 0; i <= steps; i++) {
    const y = plant.output(state)
    time.push(i * DT)
    setpointSeries.push(setpoint)
    output.push(y)

    // e = setpoint - y -> u = PID(e) -> y = plant.step(u, dt)
    const u = pid.step(setpoint, y, DT)
    state = rk4Step(plant.derivative, state, u, DT)
  }

  return { time, setpoint: setpointSeries, output }
}

function App() {
  const [kp, setKp] = useState(2)
  const [ki, setKi] = useState(0.5)
  const [kd, setKd] = useState(0.1)
  const [setpoint, setSetpoint] = useState(1)
  const [antiWindup, setAntiWindup] = useState(true)

  const { time, setpoint: setpointSeries, output } = useMemo(
    () => simulateClosedLoop({ kp, ki, kd }, setpoint, antiWindup),
    [kp, ki, kd, setpoint, antiWindup],
  )

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Simulador Interactivo de Sintonización PID
      </h1>
      <p className="mt-1 text-slate-600">
        Día 2 — lazo cerrado con PID sobre la planta Motor DC. Mueve los sliders para
        re-simular al instante.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <GainSliders
          kp={kp}
          ki={ki}
          kd={kd}
          setpoint={setpoint}
          antiWindup={antiWindup}
          onKpChange={setKp}
          onKiChange={setKi}
          onKdChange={setKd}
          onSetpointChange={setSetpoint}
          onAntiWindupChange={setAntiWindup}
        />

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <ResponseChart time={time} setpoint={setpointSeries} output={output} />
        </div>
      </div>
    </div>
  )
}

export default App
