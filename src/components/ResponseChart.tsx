import { useEffect, useRef } from 'react'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'

interface ResponseChartProps {
  time: number[]
  setpoint: number[]
  output: number[]
}

export function ResponseChart({ time, setpoint, output }: ResponseChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const opts: uPlot.Options = {
      width: container.clientWidth,
      height: 400,
      scales: { x: { time: false } },
      series: [
        {},
        { label: 'Setpoint', stroke: '#94a3b8', width: 2, dash: [6, 4] },
        { label: 'Salida', stroke: '#2563eb', width: 2 },
      ],
      axes: [{ label: 'Tiempo (s)' }, { label: 'Valor' }],
    }

    const plot = new uPlot(opts, [time, setpoint, output], container)

    return () => plot.destroy()
  }, [time, setpoint, output])

  return <div ref={containerRef} className="w-full" />
}
