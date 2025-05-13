'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0F0F0F')

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshLambertMaterial({ color: '#468585'})
    const cube = new THREE.Mesh(geometry, material)

    const geometry2 = new THREE.BoxGeometry(1, 1, 1)
    const material2 = new THREE.MeshLambertMaterial({ color: '#468585' })
    const cube2 = new THREE.Mesh(geometry2, material2)
    cube2.position.y = -2

    scene.add(cube, cube2)

    const light = new THREE.DirectionalLight(0x9CDBA6, 10)
    light.position.set(1, 1, 1)
    scene.add(light)


    // Renderer
    const renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement)
    }


    // add orbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true
    controls.enablePan = true


    const animate = () => {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      cube2.rotation.x -= 0.01
      cube2.rotation.y -= 0.01
      renderer.render(scene, camera)
    }

    animate()
  }, [])

  return <div ref={mountRef}></div>
}

export default ThreeBackground
