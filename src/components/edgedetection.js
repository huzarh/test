/* global cv */

import React, { useRef, useEffect, useState } from 'react';
import { FcAddImage } from "react-icons/fc";

import css from "./edge.css"

const EdgeDetection = ({setPoints}) => {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [coordinates, setCoordinates] = useState([]);
  useEffect(() => {
    setPoints(coordinates)
  },[coordinates]);
  useEffect(() => {
    if (imageRef.current && canvasRef.current) {
      const imgElement = imageRef.current;
      const canvasElement = canvasRef.current;
      const ctx = canvasElement.getContext('2d');

      const handleImageLoad = () => {
        canvasElement.width = imgElement.width;
        canvasElement.height = imgElement.height;
        ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

        if (cv && cv.Mat) {
          const src = cv.imread(imgElement);
          const dst = new cv.Mat();
          cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
          cv.Canny(src, dst, 50, 100, 3, false);

          const contours = new cv.MatVector();
          const hierarchy = new cv.Mat();
          cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

          let largestContour = null;
          let largestArea = 0;

          for (let i = 0; i < contours.size(); ++i) {
            const contour = contours.get(i);
            const area = cv.contourArea(contour);
            if (area > largestArea) {
              largestArea = area;
              largestContour = contour;
            }
          }

          const newCoordinates = [];
          if (largestContour) {
            for (let j = 0; j < largestContour.data32S.length; j += 2) {
              const x = largestContour.data32S[j];
              const y = largestContour.data32S[j + 1];
              newCoordinates.push([x, y]);
              ctx.fillRect(x, y, 2, 2);
            }
          }

          setCoordinates(newCoordinates);

          // Koordinatları konsola yazdır
          console.log(newCoordinates);

          src.delete();
          dst.delete();
          contours.delete();
          hierarchy.delete();
        }
      };

      imgElement.addEventListener('load', handleImageLoad);

      return () => {
        imgElement.removeEventListener('load', handleImageLoad);
      };
    }
  }, []);

  return (
    // <div>
    //   <input
    //     type="file"
    //     onChange={(e) => {
    //       if (e.target.files.length > 0) {
    //         const url = URL.createObjectURL(e.target.files[0]);
    //         imageRef.current.src = url;
    //       }
    //     }}
    //   />
    //   <img ref={imageRef} alt="source" style={{ display: 'none' }} />
    //   <canvas style={{width:50}} ref={canvasRef}></canvas>
    //   <h2>Koordinatlar</h2>
    // </div>
    <form class="custom__form"> 
        <div class="custom__image-container">
          <label id="add-img-label" for="add-single-img">
          <FcAddImage />
          </label>
          <input type="file" id="add-single-img"   onChange={(e) => {
          if (e.target.files.length > 0) {
            const url = URL.createObjectURL(e.target.files[0]);
            imageRef.current.src = url;
          }
        }}/>
        </div>

        <img ref={imageRef} alt="source" style={{ display: 'none' }} />
        <canvas style={{width:200,height:0, display: 'none'}} ref={canvasRef}></canvas>
        {/* <input
          type="file"
          id="image-input"
          name="photos"
          accept="image/jpeg"
          multiple
        /> */} 
      </form>
  );
};

export default EdgeDetection;
