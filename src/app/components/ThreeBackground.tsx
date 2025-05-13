'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#FFFFFF')

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const sphereGeo = new THREE.SphereGeometry(1, 32, 32)
    const sphereMat = new THREE.MeshStandardMaterial({ color: '#F2C94C' })
    const sphere = new THREE.Mesh(sphereGeo, sphereMat)

    const planeGeo = new THREE.PlaneGeometry(3, 3)
    const planeMat = new THREE.MeshLambertMaterial({ color: '#468585' })
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.position.y = -2
    plane.rotation.x = -1.5

    scene.add(sphere, plane)

    const light = new THREE.DirectionalLight(0x9CDBA6, 10)
    light.position.set(1, 1, 1)
    scene.add(light)

    const renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    mountRef.current?.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true
    controls.enablePan = true

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)


let velocity = 0.02
const animate = () => {
  requestAnimationFrame(animate)

  sphere.position.y += velocity

  const topBoundary = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z

  // Bounce off top of screen
  if (sphere.position.y + 1 >= topBoundary) {
    velocity = -Math.abs(velocity)
  }

  // Bounce off plane (instead of bottom of screen)
  const sphereBottom = sphere.position.y - 1
  const planeTop = plane.position.y + 0.01 // slight buffer to ensure visual contact
  if (sphereBottom <= planeTop) {
    velocity = Math.abs(velocity)
  }

  plane.rotation.z -= 0.01
  controls.update()
  renderer.render(scene, camera)
}



    animate();

    // Optional: cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} />
}

export default ThreeBackground
