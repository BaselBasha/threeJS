import React, { JSX, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ShaderMaterial, Mesh, Vector2 } from 'three';
const vertexShader = `
  varying vec2 vUv;
  varying float vWave;

  uniform float uTime;
  uniform vec2 uMouse;

  float random(vec3 scale, float seed) {
    return fract(sin(dot(position * scale + vec3(seed), vec3(12.9898, 78.233, 151.7182))) * 43758.5453);
  }

  void main() {
    vUv = uv;

    // Influence wave direction based on mouse X/Y
    float mouseInfluenceX = (uMouse.x - 0.5) * 10.0;
    float mouseInfluenceY = (uMouse.y - 0.5) * 10.0;

    float wave1 = sin(position.x * (5.0 + random(vec3(1.0, 0.5, 0.3), 0.0)) + uTime * 2.0 + mouseInfluenceX) * 0.2;
    float wave2 = cos(position.y * (5.0 + random(vec3(0.5, 1.5, 0.2), 1.0)) + uTime * 1.5 + mouseInfluenceY) * 0.15;
    float wave3 = sin(position.z * (4.0 + random(vec3(0.3, 1.0, 2.0), 2.0)) + uTime * 1.8 + mouseInfluenceX) * 0.1;
    float wave4 = cos(position.x * (3.0 + random(vec3(0.7, 1.2, 0.4), 3.0)) + uTime * 1.0 + mouseInfluenceY) * 0.05;
    float wave5 = sin(position.y * (6.0 + random(vec3(1.3, 0.9, 1.7), 4.0)) + uTime * 3.0 + mouseInfluenceX) * 0.25;

    float wave = wave1 + wave2 + wave3 + wave4 + wave5;
    vWave = wave;

    vec3 newPosition = position + normal * wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
varying float vWave;

uniform float uTime;
uniform vec2 uMouse;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec3 baseColor1 = vec3(0.2, 0.2, 0.4); // Dark blue
  vec3 baseColor2 = vec3(0.5, 0.4, 1.0); // Purple

  float waveStrength = abs(sin(vWave * 5.0));
  float blendFactor = smoothstep(0.4, 0.6, waveStrength);

  // Basic noise for subtle texture
  float baseNoise = noise(vUv * 10.0 + uTime * 0.3);

  // Glitch factor spikes with time + mouse
  float glitch = step(0.95, fract(sin(dot(vUv * uMouse * 20.0, vec2(23.3, 41.7))) * 43758.5453 + uTime * 10.0));

  // Random channel shift for glitch effect
  float rShift = noise(vUv * 50.0 + uTime * 5.0);
  float gShift = noise(vUv * 55.0 - uTime * 4.0);
  float bShift = noise(vUv * 60.0 + uTime * 2.0 + uMouse.x * 10.0);

  vec3 color = mix(baseColor1, baseColor2, vUv.y + baseNoise * 0.3);

  // Glitchy burst: mix noise + channel shifts when glitch triggers
  if (glitch > 0.0) {
    color.r = mix(color.r, rShift, 0.8);
    color.g = mix(color.g, gShift, 0.8);
    color.b = mix(color.b, bShift, 0.8);
  }

  // Mix final blend and glitch into a flashy wave-reactive color
  vec3 finalColor = mix(color, baseColor1 + baseColor2, blendFactor + baseNoise * 0.2);

  gl_FragColor = vec4(finalColor, 1.0);
}

`;

type MeshProps = JSX.IntrinsicElements['mesh'];

const NoisyWavyShaderSphere: React.FC<MeshProps> = (props) => {
  const meshRef = useRef<Mesh>(null!);
  const materialRef = useRef<ShaderMaterial>(null!);
  const { mouse } = useThree();
  const [mouseVec] = useState(() => new Vector2(0.5, 0.5));

  useFrame(({ clock }) => {
    if (materialRef.current) {
      // Convert mouse to normalized coordinates [0,1]
      mouseVec.set(mouse.x * 0.5 + 0.5, mouse.y * 0.5 + 0.5);
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      materialRef.current.uniforms.uMouse.value = mouseVec;
    }
  });

  return (
    <mesh ref={meshRef} {...props}>
      <sphereGeometry args={[7, 256, 256]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new Vector2(0.5, 0.5) },
        }}
      />
    </mesh>
  );
};

export default NoisyWavyShaderSphere;
