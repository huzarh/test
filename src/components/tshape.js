import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
// import paths from "./ucgen.json"
import { saveAs } from "file-saver";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";

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

  // Spline oluşturma (bu spline dinamik bir yoldur)
  const curvePoints = paths.map((e) => new THREE.Vector3(e[0], e[1], 0));

  const curve = new THREE.CatmullRomCurve3(curvePoints);

  const height = -15;
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

  // ExtrudeGeometry yerine TubeGeometry kullanarak spline boyunca ekstrüzyon yapma
  const extrudeSettings = {
    steps: 200,
    bevelEnabled: false,
    extrudePath: curve,
  };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  return (
    <>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial color={"#089ae5"} />
      </mesh>
    </>
  );
};

export default TShapeSpline;
