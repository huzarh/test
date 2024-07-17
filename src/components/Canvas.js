import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./Canvas.css";
import TShapeSpline from "./tshape";

const Scene = ({ points }) => {
  const [exportSTL, setExportSTL] = useState(false);

  console.log("==>", points);

  function findMaxCoordinates(points) {
    const maxX = Math.max(...points.map((point) => point[0]));
    const minX = Math.min(...points.map((point) => point[0]));
    const maxY = Math.max(...points.map((point) => point[1]));
    const minY = Math.min(...points.map((point) => point[1]));
    return [maxX, maxY, minX, minY];
  }

  const [maxX, maxY, minX, minY] = findMaxCoordinates(points);
  const [xcntr, setXcntr] = useState(0);
  const [ycntr, setYcntr] = useState(0);
  console.log(maxX, maxY, minX, minY, "--->", xcntr, ycntr);

  useEffect(() => {
    // Calculate the center value after the component has mounted or points change
    setXcntr((maxX + minX) / 2);
    setYcntr((maxY + minY) / 2);
  }, [maxX, maxY, minX, minY]); // Added minX and minY to dependency array

  // Function to export STL file (for testing purposes)

  return (
    <div className="cnvs">
      {points && points.length > 0 ? (
        <>          
          <Canvas
            className="Can"
            style={{ background: "#000", height: "30vh", borderRadius: 10 }}
          >
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <axesHelper args={[1000]} />
            <gridHelper />
            <TShapeSpline paths={points} exportSTL={exportSTL} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              zoomSpeed={0.5}
              dampingFactor={0.1}
              target={[xcntr, ycntr, 4]} // Center of rotation (optional)
            />
          </Canvas>
          <button onClick={() => setExportSTL((e) => !e)}>Indir STL</button>
        </>
      ) : (
        <div
          className="Can"
          style={{ background: "#000", height: "30vh", borderRadius: 10 }}
        ></div>
      )}
    </div>
  );
};

export default Scene;
