import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/generate-ppt", {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume_presentation.pptx";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="page">

      {/* HERO */}
      <div className="hero">
        <div className="badge">✨ AI-powered with Groq</div>

        <h1>
          Resume → Beautiful <br /> PowerPoint
        </h1>

        <p>
          Upload your PDF or DOCX resume. We'll structure it with AI and generate
          a polished presentation you can download instantly.
        </p>
      </div>

      {/* UPLOAD CARD */}
      <div className="upload-card">

        <div className="upload-icon">⬆️</div>

        <h2>Upload your resume</h2>
        <p className="subtext">
          Drag & drop a PDF or DOCX file, or click to browse
        </p>

        <input
          type="file"
          accept=".pdf,.docx"
          id="fileUpload"
          onChange={(e) => setFile(e.target.files[0])}
          hidden
        />

        <label htmlFor="fileUpload" className="file-btn">
          📄 Choose file
        </label>

        {file && <p className="file-name">{file.name}</p>}

        <button className="generate-btn" onClick={handleUpload}>
          {loading ? "Generating..." : "Generate PPT"}
        </button>

      </div>

    </div>
  );
}

export default App;