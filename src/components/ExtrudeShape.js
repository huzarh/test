import React, { useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { saveAs } from 'file-saver';
import { STLExporter } from 'three-stdlib';

const ExtrudeShape = ({ shape }) => {
  const { scene } = useThree();
  
  const geometry = useMemo(() => {
    const shapePoints = shape.map(p => new THREE.Vector2(p.x, p.y));
    const shape3D = new THREE.Shape(shapePoints);
    const extrudeSettings = {
      steps: 10,
      depth: 4,
      bevelEnabled: false,
    };
    return new THREE.ExtrudeGeometry(shape3D, extrudeSettings);
  }, [shape]);

  const exportSTL = () => {
    const exporter = new STLExporter();
    const stlString = exporter.parse(scene);
    const blob = new Blob([stlString], { type: 'text/plain' });
    saveAs(blob, 'model.stl');
  };

  return (
    <>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <mesh geometry={geometry}>
          <meshStandardMaterial color={'orange'} />
        </mesh>
        <OrbitControls />
      </Canvas>
      <button onClick={exportSTL}>Export STL</button>
    </>
  );
};

export default ExtrudeShape;
