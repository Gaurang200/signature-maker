import React, { useRef, useState } from "react";

const SignatureCanvas = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [penColor, setPenColor] = useState("#808080");
  const [penSize, setPenSize] = useState(0.5);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    ctx.stroke();
  };

  const endDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL();
    localStorage.setItem("savedSignature", url);
    const a = document.createElement("a");
    a.href = url;
    a.download = "signature.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const retrieveSignature = () => {
    const savedSignature = localStorage.getItem("savedSignature");
    if (savedSignature) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = savedSignature;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    } else {
      alert("No saved signature found.");
    }
  };

  return (
    <div className="container">
      <div className="controls my-3 text-center">
        <div className="control col-3">
          <p>Background</p>
          <input
            type="color"
            style={{height: "36px" }}
            value={backgroundColor}
            className="input_box "
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
        <div className="control col-3">
          <p>Text color picker</p>
          <input
            type="color"
            style={{height: "36px" }}
            className="input_box"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
          />
        </div>
        <div className="control col-3">
          <p>Font size</p>
          <select
            value={penSize}
            onChange={(e) => setPenSize(e.target.value)}
            className="select_box"
          >
            <option value="0.5">5px</option>
            <option value="2">10px</option>
            <option value="3">15px</option>
            <option value="4">20px</option>
            <option value="5">25px</option>
            <option value="6">30px</option>
          </select>
        </div>
      </div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={1150}
          height={500}
          style={{ backgroundColor: backgroundColor }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          className="canvas"
        />
      </div>
      <div className="buttons my-3">
        <button onClick={clearCanvas} className="btn btn-danger btn_width col-3">
          Clear
        </button>
        <button onClick={downloadSignature} className="btn btn-success btn_width col-3">
          Save & download
        </button>
        <button onClick={retrieveSignature} className="btn btn-warning btn_width col-3">
          Retrieve saved signature
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
