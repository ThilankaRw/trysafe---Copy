import { useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [files, setFiles] = useState([
    { id: 1, name: "Documents", type: "folder" },
    { id: 2, name: "Images", type: "folder" },
    { id: 3, name: "report.pdf", type: "file" },
    { id: 4, name: "presentation.pptx", type: "file" },
  ]);

  const [recentFiles] = useState([
    { id: 5, name: "Recent Doc 1.pdf", type: "file", date: "2024-01-20" },
    { id: 6, name: "Recent Doc 2.docx", type: "file", date: "2024-01-19" },
  ]);

  const [favorites] = useState([
    { id: 7, name: "Important Folder", type: "folder" },
    { id: 8, name: "Project Files", type: "folder" },
  ]);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFiles([
          ...files,
          {
            id: files.length + 1,
            name: file.name,
            type: "file",
          },
        ]);
      }
    };
    input.click();
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <input type="text" placeholder="Search files..." />
        <div>User Profile</div>
      </div>

      <div className="dropbox-layout">
        <div className="sidebar">
          <button className="upload-button" onClick={handleUpload}>
            Upload File
          </button>

          <div className="sidebar-item">
            <i>🏠</i>
            <span>Home</span>
          </div>
          <div className="sidebar-item">
            <i>📁</i>
            <span>Files</span>
          </div>
          <div className="sidebar-item">
            <i>👥</i>
            <span>Shared</span>
          </div>
          <div className="sidebar-item">
            <i>🗑️</i>
            <span>Trash</span>
          </div>

          <div className="section-title">Storage</div>
          <div className="storage-bar">
            <div className="storage-used"></div>
          </div>
          <div>65% of 100GB used</div>
        </div>

        <div className="main-content">
          <div>
            <div className="section-title">Recent Files</div>
            <div className="file-grid">
              {recentFiles.map((file) => (
                <div key={file.id} className="file-item">
                  <div>{file.type === "folder" ? "📁" : "📄"}</div>
                  <div>{file.name}</div>
                  <div>{file.date}</div>
                </div>
              ))}
            </div>

            <div className="section-title">Favorites</div>
            <div className="file-grid">
              {favorites.map((file) => (
                <div key={file.id} className="file-item">
                  <div>{file.type === "folder" ? "📁" : "📄"}</div>
                  <div>{file.name}</div>
                </div>
              ))}
            </div>

            <div className="section-title">All Files</div>
            <div className="file-grid">
              {files.map((file) => (
                <div key={file.id} className="file-item">
                  <div>{file.type === "folder" ? "📁" : "📄"}</div>
                  <div>{file.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
