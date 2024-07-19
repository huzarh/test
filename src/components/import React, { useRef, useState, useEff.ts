import React, { useRef, useState, useEffect } from 'react';
import css from "./drawing.module.css";

const ShapeDrawer = ({ onShapeDrawn }) => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  };

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    setPoints([...points, { x, y }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    setPoints([...points.slice(0, -1), { x, y }]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (points.length > 0) {
      onShapeDrawn(points);
    }
  };

  const draw = (ctx, points) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = 'brown';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;

    // Draw points
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fill();

      // Draw lines between points
      if (index > 0) {
        const prevPoint = points[index - 1];
        ctx.beginPath();
        ctx.moveTo(prevPoint.x, prevPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    draw(ctx, points);
  }, [points]);

  return (
    <>
    <canvas
      className={css.cnv}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      // onMouseUp={handleMouseUp}
    /><button onClick={handleMouseUp}>wc</button></>
  );
};

export default ShapeDrawer;
