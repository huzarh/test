import React, { useState } from "react";
import "./App.css";
import Scene from "./components/Canvas";
import ShapeDrawer from "./components/ShapeDrawer";
import elma from "./components/elma.json"
import yildiz from "./components/yildiz.json"
import kare from "./components/kare.json"
import ucgen from "./components/ucgen.json"

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
