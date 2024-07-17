// import React, { useRef } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';
// import { saveAs } from 'file-saver';
// import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';

// const TShapeSpline = () => {
//   const meshRef = useRef();

//   // Spline oluşturma (bu spline dinamik bir yoldur)
//   const curve = new THREE.CatmullRomCurve3([
//     new THREE.Vector3(1, 2, 0),
//     new THREE.Vector3(6, 9, 2),
//     new THREE.Vector3(4, 3, 5),
//   ]);
//   const LineExtruder = ({ points }) => {
 
//     const ref = useRef();
//     const { camera } = useThree();
//     const [geometry, setGeometry] = useState(null);
  
//     useEffect(() => {
//       if (points.length >= 2) {
//         const curvePoints = points.map(point => new THREE.Vector3(point[0], point[1], 0));
//         const curvePath = new THREE.CurvePath();
        
//         // Add line segments to the curve path
//         for (let i = 0; i < curvePoints.length - 1; i++) {
//           const lineCurve = new THREE.LineCurve3(curvePoints[i], curvePoints[i + 1]);
//           curvePath.add(lineCurve);
//         }
  
//         const tubeGeometry = new THREE.TubeGeometry(curvePath, 50, 2, 8, false);
  
//         // Centering and positioning
//         tubeGeometry.computeBoundingBox();
//         const box = tubeGeometry.boundingBox;
//         const center = new THREE.Vector3();
//         box.getCenter(center);
  
//         // Set camera position
//         const size = box.getSize(new THREE.Vector3()).length();
//         camera.position.set(center.x, center.y, size * 1.5);
//         camera.near = 1;
//         camera.far = 1000;
//         camera.lookAt(center);
  
//         setGeometry(tubeGeometry);
//       }
//     }, [points, camera]);
  
//     return geometry ? (
//       <mesh ref={ref} geometry={geometry}>
//         <meshStandardMaterial color={'#089ae5'} />
//       </mesh>
//     ) : null;
//   };
//   // T şeklindeki profili oluşturma
//   const shape = new THREE.Shape();
//   shape.moveTo(-5, 0);
//   shape.lineTo(-2.5, 0);
//   shape.lineTo(-2.5, 2.5);
//   shape.lineTo(2.5, 2.5);
//   shape.lineTo(2.5, 0);
//   shape.lineTo(5, 0);
//   shape.lineTo(5, -1);
//   shape.lineTo(-5, -1);
//   shape.lineTo(-5, 0);

//   // ExtrudeGeometry yerine TubeGeometry kullanarak spline boyunca ekstrüzyon yapma
//   const extrudeSettings = {
//     steps: 200,
//     bevelEnabled: false,
//     extrudePath: curve
//   };
//   const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

//   // STL dosyasını dışa aktarma fonksiyonu
//   const exportSTL = () => {
//     const exporter = new STLExporter();
//     const stlString = exporter.parse(meshRef.current);
//     const blob = new Blob([stlString], { type: 'text/plain' });
//     saveAs(blob, 'TShapeSpline.stl');
//   };

//   return (
//     <>
//       <mesh ref={meshRef} geometry={geometry}>
//         <meshStandardMaterial color={'orange'} />
//       </mesh>
//       <button style={{ position: 'absolute', top: '10px', left: '10px' }} onClick={exportSTL}>
//         Export STL
//       </button>
//     </>
//   );
// };

// const App = () => {
//   return (
//     <Canvas>
//       <ambientLight />
//       <pointLight position={[10, 10, 10]} />
//       <TShapeSpline />
//       <OrbitControls />
//     </Canvas>
//   );
// };

// export default TShapeSpline;
