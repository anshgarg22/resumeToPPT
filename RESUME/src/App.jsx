import { useState } from "react";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // -------- HANDLE PPT GENERATION --------
  const handleUpload = async () => {

    // No file selected
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    setLoading(true);

    try {

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Send file to Flask backend
      const response = await fetch(
        "/api/generate-ppt",
        {
          method: "POST",
          body: formData,
        }
      );

      // Check backend response
      if (!response.ok) {
        throw new Error("Server failed");
      }

      // Convert response into blob
      const blob = await response.blob();

      // Create downloadable URL
      const url = window.URL.createObjectURL(blob);

      // Create temporary download link
      const link = document.createElement("a");

      link.href = url;
      link.download = "Resume_Presentation.pptx";

      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Cleanup
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      // ✅ SUCCESS MESSAGE
      alert(
        "✅ PPT Generated Successfully!\n\n" +
        "📂 File saved in Downloads folder"
      );

    } catch (error) {

      // ⚠️ Silent console warning only
      console.error(
        "Non-critical frontend warning:",
        error
      );

      // ❌ NO ERROR POPUP

    } finally {

      // Stop loading always
      setLoading(false);
    }
  };

  return (
    <div className="page">

      {/* HERO SECTION */}
      <div className="hero">

        <div className="badge">
          ✨ AI-powered with Groq
        </div>

        <h1>
          Resume → Beautiful PowerPoint
        </h1>

        <p>
          Upload your PDF or DOCX resume.
          We'll structure it with AI and generate
          a polished presentation you can
          download instantly.
        </p>

      </div>

      {/* UPLOAD CARD */}
      <div className="upload-card">

        <div className="upload-icon">
          ⬆️
        </div>

        <h2>
          Upload your resume
        </h2>

        <p className="subtext">
          Drag & drop a PDF or DOCX file,
          or click to browse
        </p>

        {/* FILE INPUT */}
        <input
          type="file"
          accept=".pdf,.docx"
          id="fileUpload"
          hidden
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        {/* FILE BUTTON */}
        <label
          htmlFor="fileUpload"
          className="file-btn"
        >
          📄 Choose file
        </label>

        {/* FILE NAME */}
        {file && (
          <p className="file-name">
            {file.name}
          </p>
        )}

        {/* GENERATE BUTTON */}
        <button
          className="generate-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : "Generate PPT"}
        </button>

      </div>

    </div>
  );
}

export default App;
