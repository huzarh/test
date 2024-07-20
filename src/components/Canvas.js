import React, { useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./Canvas.css";
import TShapeSpline from "./tshape";
import EdgeDetection from "./edgedetection";

const Scene = ({ points, setPoints }) => {
  const [exportSTL, setExportSTL] = useState(false);
  const [maxSize, setMaxSize] = useState(10);
  const [height, setHeight] = useState(5);
  const [thickness, setThickness] = useState(1);

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
  }, [maxX, maxY, minX, minY]);

  const handleExport = () => {
    // You can pass these options to your export logic
    console.log("Exporting with options:", { maxSize, height, thickness });
    setExportSTL(true);
  };

  return (
    <div className="cnvs">
      {points && points.length > 1 ? (
        <>
          <Canvas
            className="Can"
            style={{ background: "#000", height: "30vh", borderRadius: 10 }}
          >
            <ambientLight />
            <pointLight position={[10, 100, 10]} intensity={9} />
            {/* <axesHelper args={[1000]} />
            <gridHelper /> */}
            <TShapeSpline paths={points} exportSTL={exportSTL} />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              zoomSpeed={0.5}
              dampingFactor={0.1}
              target={[xcntr, -ycntr, 4]} // Center of rotation (optional)
            />
          </Canvas>
          <br />
          <section>
            <label>
              Maksimum Boyut:{" "}
              <input
                type="number"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
              />
            </label>
            <br />
            <label>
              Yükseklik:{" "}
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </label>
            <br />
            <label>
              Kalınlık:{" "}
              <input
                type="number"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
              />
            </label>
            <br />
            <button onClick={handleExport}>Indir STL</button>
          </section>
        </>
      ) : (
        <div
          className="Can"
          style={{ background: "#000", height: "30vh", borderRadius: 10 }}
        ></div>
      )}
      <br />
    </div>
  );
};

export default Scene;
