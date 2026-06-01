import { useState } from "react";
import "./App.css";

function App() {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {

    if (files.length === 0) {
      alert("Please select at least one resume");
      return;
    }

    setLoading(true);
    setProgress("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(`Processing ${i + 1} of ${files.length}: ${file.name}`);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "http://localhost:5000/generate-ppt",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to process ${file.name}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // =========================
        // GET FILENAME FROM BACKEND
        // =========================

        const contentDisposition =
          response.headers.get("Content-Disposition");

        let filename = `Resume_${i + 1}_Presentation.pptx`;

        if (contentDisposition) {
          const match = contentDisposition.match(
            /filename="?([^"]+)"?/
          );

          if (match?.[1]) {
            filename = match[1];
          }
        }

        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);
      }

      alert(
        `✅ Success! ${files.length} PPT(s) downloaded to your Downloads folder.`
      );
      setFiles([]);
      setProgress("");

    } catch (error) {

      console.error(
        "Error processing resumes:",
        error
      );
      alert("❌ Error: " + error.message);

    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="page">

      <div className="hero">

        <div className="badge">
          ✨ AI-powered with Groq
        </div>

        <h1>
          Resume → Beautiful PowerPoint
        </h1>

        <p>
          Upload one or multiple PDF/DOCX resumes.
          We'll structure them with AI and generate
          polished presentations you can
          download instantly.
        </p>

      </div>

      <div className="upload-card">

        <div className="upload-icon">
          ⬆️
        </div>

        <h2>
          Upload your resumes
        </h2>

        <p className="subtext">
          Select one or multiple PDF or DOCX files,
          or click to browse
        </p>

        <input
          type="file"
          accept=".pdf,.docx"
          id="fileUpload"
          hidden
          multiple
          onChange={handleFileSelect}
        />

        <label
          htmlFor="fileUpload"
          className="file-btn"
        >
          📄 Choose files
        </label>

        {files.length > 0 && (
          <div className="file-list">
            <p className="file-count">
              {files.length} file(s) selected
            </p>
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span>{file.name}</span>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveFile(index)}
                  type="button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          className="generate-btn"
          onClick={handleUpload}
          disabled={loading || files.length === 0}
        >
          {loading
            ? "Generating..."
            : `Generate PPT${files.length > 1 ? "s" : ""}`}
        </button>

        {progress && (
          <p className="progress-text">
            {progress}
          </p>
        )}

      </div>

    </div>
  );
}

export default App;