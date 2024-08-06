import React, { useRef, useState, useEffect } from "react";
import css from "./drawing.module.css";

const ShapeDrawer = ({ setPoints, points }) => {
  const canvasRef = useRef(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [draggingControlPoint, setDraggingControlPoint] = useState(null);
  const [controlPoints, setControlPoints] = useState([]);

  const pointStyle = {
    radius: 5,
    fillColor: "green",
    borderColor: "yellow",
    borderWidth: 2,
  };
  const lineStyle = {
    color: "grey",
    width: 5,
  };

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, []);

  const getMousePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getMousePosition(e);

    for (let i = 0; i < controlPoints.length; i++) {
      const controlPoint = controlPoints[i];
      if (Math.hypot(controlPoint.x - x, controlPoint.y - y) < 5) {
        setDraggingControlPoint(i);
        return;
      }
    }

    const index = points.findIndex(
      (point) => Math.hypot(point[0] - x, point[1] - y) < 5
    );
    if (index >= 0) {
      setDraggingIndex(index);
    } else {
      const newPoints = [...points, [x, y]];
      setPoints(newPoints);
      updateControlPoints(newPoints);
    }
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
    setDraggingControlPoint(null);
  };

  const handleMouseMove = (e) => {
    const { x, y } = getMousePosition(e);

    if (draggingControlPoint !== null) {
      const newControlPoints = [...controlPoints];
      console.log(controlPoints)
      newControlPoints[draggingControlPoint] = { x, y };
      setControlPoints(newControlPoints);
      draw(points, newControlPoints);
      return;
    }

    if (draggingIndex !== null) {
      const newPoints = [...points];
      newPoints[draggingIndex] = [x, y];
      setPoints(newPoints);
      updateControlPoints(newPoints);
    }
  };

  const updateControlPoints = (newPoints) => {
    const newControlPoints = newPoints.map((point, index) => {
      if (index === 0) return null;
      const prevPoint = newPoints[index - 1];
      return {
        x: (point[0] + prevPoint[0]) / 2,
        y: (point[1] + prevPoint[1]) / 2,
      };
    }).slice(1);
    setControlPoints(newControlPoints);
    draw(newPoints, newControlPoints);
  };

  const draw = (points, controlPoints) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);

      for (let i = 1; i < points.length; i++) {
        const cp = controlPoints[i - 1];
        if (cp) {
          ctx.quadraticCurveTo(cp.x, cp.y, points[i][0], points[i][1]);
        } else {
          ctx.lineTo(points[i][0], points[i][1]);
        }
      }

      ctx.strokeStyle = lineStyle.color;
      ctx.lineWidth = lineStyle.width;
      ctx.stroke();
    }

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], pointStyle.radius, 0, 2 * Math.PI);
      ctx.fillStyle = pointStyle.fillColor;
      ctx.fill();
      if (pointStyle.borderColor) {
        ctx.lineWidth = pointStyle.borderWidth;
        ctx.strokeStyle = pointStyle.borderColor;
        ctx.stroke();
      } 
    });

    controlPoints.forEach((cp) => {
      if (cp) {
        ctx.beginPath();
        ctx.arc(cp.x, cp.y, pointStyle.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "blue";
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    updateControlPoints(points);
  }, [points]);

  return (
    
    <canvas
      className={css.cnv}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default ShapeDrawer;
