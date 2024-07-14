import React, { useRef, useState, useEffect } from 'react';
import css from "./drawing.module.css";

const ShapeDrawer = ({ onShapeDrawn }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);

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

  const handleMouseDown = () => setIsDrawing(true);

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (lines.length > 0) {
      const points = lines[0].reduce((acc, point, idx, arr) => {
        if (idx % 2 === 0) acc.push([arr[idx], arr[idx + 1]]);
        return acc;
      }, []);
      onShapeDrawn(points);
      setLines([]); // Clear lines after shape is drawn
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const newLines = [...lines];
    let lastLine = newLines[newLines.length - 1];

    if (lastLine) {
      lastLine.push(x, y);
    } else {
      lastLine = [x, y];
      newLines.push(lastLine);
    }

    setLines(newLines);

    // Draw on the canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
        newLines.forEach(line => {
      ctx.moveTo(line[0], line[1]);
      for (let i = 2; i < line.length; i += 2) {
        ctx.lineTo(line[i], line[i + 1]);
      }
    });
    ctx.stroke();
  };

  return (
    <canvas
      className={css.cnv}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
};

export default ShapeDrawer;
