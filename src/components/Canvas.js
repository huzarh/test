import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import './Canvas.css';

const LineExtruder = ({points,target }) => {
   
  const ref = useRef();
  const { camera } = useThree();
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    if (points.length >= 2) {
      const shape = new THREE.Shape();

      // Create lines and add them to shape
      const path = new THREE.Path();
      points.forEach((point, index) => {
        if (index === 0) {
          path.moveTo(point[0], point[1]);
        } else {
          path.lineTo(point[0], point[1]);
        }
      });
      shape.holes.push(path);

      // Extrude settings
      const extrudeSettings = {
        depth: 8,  // Use lineThickness for the extrusion depth
        bevelEnabled: false
      };

      const lineGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

      // Centering and positioning
      lineGeometry.computeBoundingBox();
      const box = lineGeometry.boundingBox;
      const center = new THREE.Vector3(target);
      box.getCenter(center);

      // Set camera position
      const size = box.getSize(new THREE.Vector3()).length();
      camera.position.set(200, 200, 200);
      camera.near = 1;  
      camera.far = 1000;
      camera.lookAt(center);

      setGeometry(lineGeometry);
    }
  }, [points, camera]);

  return geometry ? (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color={'#089ae5'} />
    </mesh>
  ) : null;
};

const AxesHelper = () => {
  return (
    <axesHelper args={[1000]} />
  );
};

const Scene = ({points}) => {
    
 console.log('==>',points);
  
  function findMaxCoordinates(points) {
    const maxX = Math.max(...points.map(point => point[0]));
    const minX = Math.min(...points.map(point => point[0]));
    const maxY = Math.max(...points.map(point => point[1]));
    const minY = Math.min(...points.map(point => point[1]));
    return [maxX, maxY,minX,minY];
  }

  const [maxX, maxY,minX,minY] = findMaxCoordinates(points);
  const [xcntr, setXcntr] = useState(0);
  const [ycntr, setYcntr] = useState(0);
  console.log(maxX, maxY,minX,minY,"--->",xcntr,ycntr)
  useEffect(() => {
    // Calculate the center value after the component has mounted or points change
    setXcntr((maxX+minX)/2);
    setYcntr((maxY+minY)/2);
  }, [maxX, maxY]); // Dependency array ensures this effect runs only when maxX or maxY changes

  return (
    <div className='cnvs'>
      <Canvas className='Can' style={{ background: '#000', height: '30vh', borderRadius: 10 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {/* <AxesHelper /> */}
        <LineExtruder points={points}  target={[xcntr, ycntr, 4]}/>
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.5}
          dampingFactor={0.1}
          target={[xcntr, ycntr, 4]} // Center of rotation (optional)
        />
      </Canvas>
    </div>
  );
};

export default Scene;
