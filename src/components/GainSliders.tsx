interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

function SliderRow({ label, value, min, max, step, onChange }: SliderRowProps) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 rounded border border-slate-300 px-1 py-0.5 text-right text-sm"
        />
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full"
      />
    </label>
  )
}

interface GainSlidersProps {
  kp: number
  ki: number
  kd: number
  setpoint: number
  antiWindup: boolean
  onKpChange: (value: number) => void
  onKiChange: (value: number) => void
  onKdChange: (value: number) => void
  onSetpointChange: (value: number) => void
  onAntiWindupChange: (value: boolean) => void
}

export function GainSliders({
  kp,
  ki,
  kd,
  setpoint,
  antiWindup,
  onKpChange,
  onKiChange,
  onKdChange,
  onSetpointChange,
  onAntiWindupChange,
}: GainSlidersProps) {
  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <SliderRow label="Setpoint" value={setpoint} min={0} max={5} step={0.1} onChange={onSetpointChange} />
      <SliderRow label="Kp" value={kp} min={0} max={10} step={0.1} onChange={onKpChange} />
      <SliderRow label="Ki" value={ki} min={0} max={5} step={0.05} onChange={onKiChange} />
      <SliderRow label="Kd" value={kd} min={0} max={2} step={0.01} onChange={onKdChange} />

      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={antiWindup}
          onChange={(e) => onAntiWindupChange(e.target.checked)}
        />
        Anti-windup
      </label>
    </div>
  )
}
