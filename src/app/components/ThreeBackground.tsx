'use client'

import { Canvas } from '@react-three/fiber'
import {  OrbitControls } from '@react-three/drei'
import NoisyWavyShaderSphere from './RotatingCube'


const ThreeBackground = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
           <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <NoisyWavyShaderSphere position={[0, 0, 0]} />
      <OrbitControls />
    </Canvas>
    </div>
  )
}

export default ThreeBackground