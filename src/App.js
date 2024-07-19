import React, { useState } from "react";
import "./App.css";
import Scene from "./components/Canvas";
import ShapeDrawer from "./components/ShapeDrawer";
import elma from "./components/elma.json";
import yildiz from "./components/yildiz.json";
import kare from "./components/kare.json";
import ucgen from "./components/ucgen.json";
import sobel from 'sobel';
import ImageProcessingComponent from "./img";
import EdgeDetection from "./components/edgedetection";
import { FcFullTrash } from "react-icons/fc";


function App() {
  const [points, setPoints] = useState([]);

  const chngae = () => {
    setPoints(elma);
    console.log(points);
  };

  const chngae2 = () => setPoints(yildiz);
  const chngae3 = () => setPoints(kare);
  const chngae4 = () => setPoints(ucgen);
  const rv = () => setPoints([]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Kurabiye Kalıbı 0.1</h1>
      </header>
        
      <div className="container">
        <section className="drawsec">
          <header style={{ textAlign: "start" }}>
            Çizarak istediğiniz kalıbı oluşturun !!
          </header>
          <ShapeDrawer setPoints={setPoints} points={points} />
          <div className="bottom">
            <button ><FcFullTrash onClick={rv} cursor="pointer" /> </button>
            <button onClick={chngae2}>Yıldız</button>
            <button onClick={chngae3}>Kare</button>
            <button onClick={chngae4}>Üçgen</button>
          </div>
        </section>
        <Scene points={points} setPoints={setPoints}/>
      </div>
    </div>
  );
}

export default App;
