import React, { useState } from "react";
import sobel from "sobel";
import { saveAs } from "file-saver";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";

const ImageProcessingComponent = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [xEdges, setXEdges] = useState([]);
  const [yEdges, setYEdges] = useState([]);

  // Resmi yükle ve işle
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const image = new Image();
      image.src = reader.result;

      image.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);

        const { data, width, height } = imageData;
        const greyData = new Uint8ClampedArray(width * height);

        // Gri tonlamalı hale getirme
        for (let i = 0; i < data.length; i += 4) {
          greyData[i / 4] = data[i]; // Red channel
        }

        // Sobel filtresini uygula
        const { xEdges, yEdges } = sobel(greyData, width, height);

        // Kenarları state'e kaydet
        setXEdges(xEdges);
        setYEdges(yEdges);
      };
    };

    if (file) {
      reader.readAsDataURL(file);
      setImageSrc(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {imageSrc && (
        <img src={imageSrc} alt="Selected" style={{ maxWidth: "100%" }} />
      )}
      <div>
        <h3>X Koordinatları:</h3>
        <pre>{JSON.stringify(xEdges, null, 2)}</pre>
        <h3>Y Koordinatları:</h3>
        <pre>{JSON.stringify(yEdges, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ImageProcessingComponent;
