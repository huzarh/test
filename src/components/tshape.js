import React, { useEffect, useRef } from "react";
import { saveAs } from "file-saver";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import * as THREE from "three";

const TShapeSpline = ({ paths, exportSTL }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (exportSTL && meshRef.current) {
      const exporter = new STLExporter();
      const stlString = exporter.parse(meshRef.current);
      const blob = new Blob([stlString], { type: "application/sla" });
      saveAs(blob, "TShape.stl");
    }
  }, [exportSTL]);

  // Create a closed spline path
  const curvePoints = paths.map((e) => new THREE.Vector3(e[0], -e[1], 0));
  if (curvePoints.length > 2) {
    curvePoints.push(curvePoints[0]); // Close the path
  }

  const curve = new THREE.CatmullRomCurve3(curvePoints);

  const height = -25;
  const thead = -2;
  const shape = new THREE.Shape();
  shape.moveTo(thead, 3);
  shape.lineTo(0, 3);
  shape.lineTo(0, thead);
  shape.lineTo(thead, thead);

  shape.lineTo(thead, thead);
  shape.lineTo(thead, -1);
  shape.lineTo(height, -1);
  shape.lineTo(height, 2);
  shape.lineTo(thead, 2);

  // Extrude along the closed spline path
  const extrudeSettings = {
    steps: 500,
    bevelEnabled: false,
    extrudePath: curve,
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color={"white"} />
    </mesh>
  );
};

export default TShapeSpline;
