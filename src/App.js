import React, { useState } from "react";
import "./App.css";
import Scene from "./components/Canvas";
import ShapeDrawer from "./components/ShapeDrawer";
import elma from "./components/elma.json";
import yildiz from "./components/yildiz.json";
import kare from "./components/kare.json";
import ucgen from "./components/ucgen.json";
import EdgeDetection from "./components/edgedetection";
import { FcFullTrash } from "react-icons/fc";
import { FaRegStar } from "react-icons/fa6";
import { FaSquare } from "react-icons/fa";
import { IoMdFlower } from "react-icons/io";
import { CiApple } from "react-icons/ci";


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
          {/* <header style={{ textAlign: "start" }}>
            Çizarak istediğiniz kalıbı oluşturun !!
          </header> */}
          <div className="bottom">
          <EdgeDetection setPoints={setPoints} />
          <hr style={{color:"black",border:"0.5px solid #089ae5",height:1,width:"100%"}}/>

            <button onClick={rv}>
              <FcFullTrash cursor="pointer" />{" "}
            </button>
            <hr style={{color:"black",border:"0.5px solid #089ae5",height:1,width:"100%"}}/>

            <button onClick={chngae2}>
              <FaRegStar />
            </button>
            <button onClick={chngae3}>
              <FaSquare />
            </button>
            <button onClick={chngae4}>
              <IoMdFlower />
            </button>
            <button onClick={chngae}>
              <CiApple />
            </button>
          </div>
          <ShapeDrawer setPoints={setPoints} points={points} />
        </section>
        <Scene points={points} setPoints={setPoints} />
      </div>
    </div>
  );
}

export default App;
