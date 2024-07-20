import React, { useRef, useState, useEffect } from "react";
import css from "./drawing.module.css";

const ShapeDrawer = ({ setPoints, points }) => {
  const canvasRef = useRef(null);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [draggingControlPoint, setDraggingControlPoint] = useState(null);

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

  const controlPoints = useRef([]);

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

    for (let i = 0; i < controlPoints.current.length; i++) {
      const controlPoint = controlPoints.current[i];
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
      setPoints([...points, [x, y]]);
    }
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
    setDraggingControlPoint(null);
  };

  const handleMouseMove = (e) => {
    const { x, y } = getMousePosition(e);

    if (draggingControlPoint !== null) {
      const newControlPoints = [...controlPoints.current];
      newControlPoints[draggingControlPoint] = { x, y };
      controlPoints.current = newControlPoints;
      draw();
      return;
    }

    if (draggingIndex !== null) {
      const newPoints = [...points];
      newPoints[draggingIndex] = [x, y];
      setPoints(newPoints);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);

      for (let i = 1; i < points.length; i++) {
        const cp = controlPoints.current[i - 1];
        ctx.quadraticCurveTo(cp.x, cp.y, points[i][0], points[i][1]);
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

    controlPoints.current.forEach((cp) => {
      ctx.beginPath();
      ctx.arc(cp.x, cp.y, pointStyle.radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#089ae5";
      ctx.fill();
    });
  };

  useEffect(() => {
    controlPoints.current = points.map((point, index) => {
      if (index === 0) return null;
      const prevPoint = points[index - 1];
      return {
        x: (point[0] + prevPoint[0]) / 2,
        y: (point[1] + prevPoint[1]) / 2,
      };
    }).slice(1);
    draw();
  }, [points]);

  useEffect(() => {
    if (draggingIndex !== null) {
      controlPoints.current = points.map((point, index) => {
        if (index === 0) return null;
        const prevPoint = points[index - 1];
        return {
          x: (point[0] + prevPoint[0]) / 2,
          y: (point[1] + prevPoint[1]) / 2,
        };
      }).slice(1);
    }
    draw();
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
