import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, Environment, Html } from "@react-three/drei";
import * as THREE from "three";

import avatarModel from "../assets/avatar.glb";
import animationsModel from "../assets/animations.glb";
import lipsyncData from "../assets/audios/api_0.json";

// Viseme → morph target mapping
const visemeMap: Record<string, string> = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

interface LipsyncData {
  mouthCues: Array<{
    start: number;
    end: number;
    value: string;
  }>;
}

interface ModelProps {
  lipsync: LipsyncData;
}

function Model({ lipsync }: ModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(avatarModel);
  const { animations } = useGLTF(animationsModel);
  const { actions } = useAnimations(animations, group);

  // Play base animation on mount
  useEffect(() => {
    if (actions && animations.length > 0) {
      const animationName = animations[0].name;
      actions[animationName]?.play();
    }
  }, [actions, animations]);

  // Start time reference for lipsync
  const [startTime] = useState(() => performance.now() / 1000);

  // Smooth morph target function
  const lerpMorphTarget = (target: string, value: number, speed = 0.2) => {
    scene.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh && (child as THREE.SkinnedMesh).morphTargetDictionary) {
        const mesh = child as THREE.SkinnedMesh;
        const index = mesh.morphTargetDictionary[target];
        if (index !== undefined && mesh.morphTargetInfluences) {
          mesh.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            mesh.morphTargetInfluences[index],
            value,
            speed
          );
        }
      }
    });
  };

  // Update morph targets for lipsync
  useFrame(() => {
    if (!lipsync) return;

    const currentTime = performance.now() / 1000 - startTime;
    let activeViseme: string | null = null;

    for (const cue of lipsync.mouthCues) {
      if (currentTime >= cue.start && currentTime <= cue.end) {
        activeViseme = visemeMap[cue.value];
        if (activeViseme) lerpMorphTarget(activeViseme, 1, 0.2);
        break;
      }
    }

    // Reset all other visemes
    Object.values(visemeMap).forEach((viseme) => {
      if (viseme !== activeViseme) {
        lerpMorphTarget(viseme, 0, 0.1);
      }
    });
  });

  return (
    <primitive ref={group} object={scene} scale={1.5} position={[0, -1.5, 0]} />
  );
}

const Avatar3D = () => {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      onCreated={({ gl }) => {
        // Disable zoom controls
        gl.domElement.style.touchAction = 'none';
      }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={<Html center><div className="text-white">Loading avatar...</div></Html>}>
        <Model lipsync={lipsyncData as LipsyncData} />
        <Environment preset="sunset" />
      </Suspense>
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

export default Avatar3D;

