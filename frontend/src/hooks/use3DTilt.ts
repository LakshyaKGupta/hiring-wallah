'use client'

import { useMotionValue, useTransform, useSpring } from 'framer-motion'
import React, { useState } from 'react'

export function use3DTilt(maxRotation = 3) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const [isHovered, setIsHovered] = useState(false)

  const rotateX = useSpring(useTransform(y, [0, 1], [maxRotation, -maxRotation]), {
    stiffness: 100,
    damping: 32,
    mass: 1.1,
  })
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxRotation, maxRotation]), {
    stiffness: 100,
    damping: 32,
    mass: 1.1,
  })
  const scale = useSpring(isHovered ? 1.01 : 1, {
    stiffness: 150,
    damping: 30,
    mass: 0.9,
  })
  const shineX = useSpring(useTransform(x, [0, 1], [0, 100]), {
    stiffness: 120,
    damping: 32,
  })
  const shineY = useSpring(useTransform(y, [0, 1], [0, 100]), {
    stiffness: 120,
    damping: 32,
  })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    x.set(mouseX / rect.width)
    y.set(mouseY / rect.height)
    if (!isHovered) setIsHovered(true)
  }

  const handleMouseLeave = () => {
    x.set(0.5)
    y.set(0.5)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return {
    rotateX,
    rotateY,
    scale,
    shineX,
    shineY,
    isHovered,
    handleMouseMove,
    handleMouseLeave,
    handleMouseEnter,
  }
}
