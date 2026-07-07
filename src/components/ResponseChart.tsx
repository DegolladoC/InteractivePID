import { useEffect, useRef } from 'react'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'

interface ResponseChartProps {
  time: number[]
  output: number[]
}

export function ResponseChart({ time, output }: ResponseChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const opts: uPlot.Options = {
      width: container.clientWidth,
      height: 400,
      scales: { x: { time: false } },
      series: [{}, { label: 'Salida', stroke: '#2563eb', width: 2 }],
      axes: [{ label: 'Tiempo (s)' }, { label: 'Salida' }],
    }

    const plot = new uPlot(opts, [time, output], container)

    return () => plot.destroy()
  }, [time, output])

  return <div ref={containerRef} className="w-full" />
}
