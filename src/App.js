import React, { useState } from "react";
import "./App.css";
import Scene from "./components/Canvas";
import ShapeDrawer from "./components/ShapeDrawer";
import elma from "./components/elma.json"
import yildiz from "./components/yildiz.json"
import kare from "./components/kare.json"
import ucgen from "./components/ucgen.json" 
import sobel from 'sobel';

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
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
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
            {imageSrc && <img src={imageSrc} alt="Selected" style={{ maxWidth: '100%' }} />}
            <div>
                <h3>X Koordinatları:</h3>
                <pre>{JSON.stringify(xEdges, null, 2)}</pre>
                <h3>Y Koordinatları:</h3>
                <pre>{JSON.stringify(yEdges, null, 2)}</pre>
            </div>
        </div>
    );
};

 
function App() {
  const [points, setPoints] = useState([]);

  function chngae() {
    setPoints((e)=>elma);
    console.log(points)
  }
  const chngae2=()=> setPoints((e)=>yildiz);
  const chngae3=()=> setPoints((e)=>kare);
  const chngae4=()=> setPoints((e)=>ucgen);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Kurabiye Kalıbı</h1>
      </header>
      <div className="container">
        <section className="drawsec">
          <header style={{textAlign:'start'}}>Çizarak istediğiniz kalıbı oluşturun !!</header>
          <ShapeDrawer onShapeDrawn={setPoints} />
          <div className="bottom">
            <button onClick={chngae}>Elma</button>
            <button onClick={chngae2}>Yıldız</button>
            <button onClick={chngae3}>Kare</button>
            <button onClick={chngae4}>Üçgen</button>
          </div>
        </section> 
        <Scene points={points} /> 
      </div>
    </div>
  );
}

export default App;
