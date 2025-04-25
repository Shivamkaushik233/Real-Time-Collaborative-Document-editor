import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import jsPDF from "jspdf";
import "./App.css";

// Connect to the backend
const socket = io("http://localhost:5000");

function App() {
  const [documentContent, setDocumentContent] = useState("");

  // Emit content change to other users
  const handleChange = (e) => {
    setDocumentContent(e.target.value);
    socket.emit("content-change", e.target.value); // Send change to server
  };

  // Listen for real-time content updates
  useEffect(() => {
    socket.on("receive-change", (data) => {
      setDocumentContent(data);
    });
  }, []);

  // Handle PDF Certificate generation
  const generateCertificate = () => {
    const doc = new jsPDF();
    doc.setFontSize(25);
    doc.text("CodTech - Certificate of Completion", 20, 30);
    doc.setFontSize(18);
    doc.text("This certifies that you have completed the internship", 20, 60);
    doc.setFontSize(22);
    doc.text("Your Name", 20, 90);
    doc.setFontSize(16);
    doc.text(`End Date: ${new Date().toLocaleDateString()}`, 20, 120);
    doc.save("certificate.pdf");
  };

  return (
    <div className="App">
      <h1>CodTech Collaborative Document Editor</h1>
      <textarea
        value={documentContent}
        onChange={handleChange}
        placeholder="Start editing the document..."
      />
      <button onClick={generateCertificate}>Generate Certificate</button>
      <p>📜 Certificate will be issued at the end of your internship.</p>
    </div>
  );
}

export default App;
