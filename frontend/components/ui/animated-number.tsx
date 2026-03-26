"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedNumberProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
}

export function AnimatedNumber({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const startValue = 0
    const endValue = value

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4)
    }

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)

      const currentValue = startValue + (endValue - startValue) * easedProgress
      setDisplayValue(currentValue)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  const formattedValue = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString()

  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  )
}
