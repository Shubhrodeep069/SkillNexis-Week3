
import { useState } from "react";
import api from "../api";

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];

    setMessage("");
    setError("");

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please select a JPEG, PNG, WEBP, or GIF image.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  async function handleUpload(e) {
    e.preventDefault();

    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/images", formData);

      const image = {
        ...response.data.image,
        url: `http://localhost:5000${response.data.image.url}`,
      };

      setUploadedImages((current) => [image, ...current]);
      setMessage("Image uploaded successfully!");

      if (preview) URL.revokeObjectURL(preview);
      setPreview("");
      setFile(null);
      e.target.reset();
    } catch (err) {
      setError(
        err.response?.data?.message || "Image upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="dashboard-page">
      <section className="upload-dashboard">
        <header className="upload-header">
          <div>
            <p className="eyebrow">SKILLNEXIS • WEEK 3</p>
            <h1>Image Studio 🖼️</h1>
            <p className="subtitle">
              Select, preview, and upload your favourite images.
            </p>
          </div>
        </header>

        <form className="upload-card" onSubmit={handleUpload}>
          <label className="upload-dropzone" htmlFor="image-file">
            <span className="upload-symbol">↑</span>
            <strong>Choose an image</strong>
            <span>JPEG, PNG, WEBP, or GIF · Maximum 5 MB</span>
            <input
              id="image-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
            />
          </label>

          {preview && (
            <div className="preview-container">
              <p className="section-label">Preview</p>
              <img className="image-preview" src={preview} alt="Selected preview" />
              <p className="file-name">{file?.name}</p>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button className="primary-btn" disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>

        <section className="gallery-section">
          <h2>Uploaded Images</h2>

          {uploadedImages.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🌄</span>
              <h3>Your gallery is waiting</h3>
              <p>Upload an image to see it here.</p>
            </div>
          ) : (
            <div className="image-gallery">
              {uploadedImages.map((image) => (
                <article className="gallery-item" key={image.filename}>
                  <img src={image.url} alt="Uploaded file" />
                  <p>{image.filename}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
