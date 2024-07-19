import React, { useRef, useState, useEffect } from "react";
import css from "./drawing.module.css";
import img from "../assets/Снимок экрана 2024-07-18 в 2.50.08 AM.png"

const ShapeDrawer = ({ setPoints, points }) => {
  const canvasRef = useRef(null);
  const [draggingIndex, setDraggingIndex] = useState(null);

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
    const index = points.findIndex(
      (point) => Math.hypot(point[0] - x, point[1] - y) < 5
    );
    if (index >= 0) {
      setDraggingIndex(index);
    } else {
      setPoints([...points, [x, y]]);
    }
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  const handleMouseMove = (e) => {
    if (draggingIndex === null) return;
    const { x, y } = getMousePosition(e);
    const newPoints = [...points];
    newPoints[draggingIndex] = [x, y];
    setPoints(newPoints);
  };

  const draw = (ctx, points) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw points (dots)
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point[0], point[1], pointStyle.radius || 3, 0, 2 * Math.PI);
      ctx.fillStyle = pointStyle.fillColor || "white";
      ctx.fill();

      if (pointStyle.borderColor) {
        ctx.lineWidth = pointStyle.borderWidth || 1;
        ctx.strokeStyle = pointStyle.borderColor;
        ctx.stroke();
      }

      // Draw lines between points
      if (index > 0) {
        const prevPoint = points[index - 1];
        ctx.beginPath();
        ctx.moveTo(prevPoint[0], prevPoint[1]);
        ctx.lineTo(point[0], point[1]);
        ctx.strokeStyle = lineStyle.color || "white";
        ctx.lineWidth = lineStyle.width || 2;
        if (lineStyle.dash) {
          ctx.setLineDash(lineStyle.dash);
        } else {
          ctx.setLineDash([]);
        }
        ctx.stroke();
      }
    });

    // Draw line connecting last point to the first point
    if (points.length > 2) {
      const firstPoint = points[0];
      const lastPoint = points[points.length - 1];
      ctx.beginPath();
      ctx.moveTo(lastPoint[0], lastPoint[1]);
      ctx.lineTo(firstPoint[0], firstPoint[1]);
      ctx.strokeStyle = lineStyle.color || "white";
      ctx.lineWidth = lineStyle.width || 2;
      if (lineStyle.dash) {
        ctx.setLineDash(lineStyle.dash);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    draw(ctx, points);
  }, [points, pointStyle, lineStyle]);

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
