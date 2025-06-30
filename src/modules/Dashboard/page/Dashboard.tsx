import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFolder, FaFile } from 'react-icons/fa';

// Define the File interface
interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: string;
  folder: string;
}

// Mock API function (replace with your actual API call)
const fetchFiles = async (): Promise<FileItem[]> => {
  return [
    { id: '1', name: 'Learn Animation', size: 34 * 1024 * 1024, type: 'pdf', lastModified: '2023-01-10', folder: 'Documents' },
    { id: '2', name: 'Report.docx', size: 16 * 1024 * 1024, type: 'docx', lastModified: '2023-01-20', folder: 'Work' },
    { id: '3', name: 'Budget.xlsx', size: 48 * 1024 * 1024, type: 'xlsx', lastModified: '2023-01-30', folder: 'Finance' },
    { id: '4', name: 'Photo.jpg', size: 5 * 1024 * 1024, type: 'jpg', lastModified: '2023-02-01', folder: 'Photos' },
    { id: '5', name: 'Notes.txt', size: 1 * 1024 * 1024, type: 'txt', lastModified: '2023-02-05', folder: 'Notes' },
    { id: '6', name: 'Presentation.pptx', size: 20 * 1024 * 1024, type: 'pptx', lastModified: '2023-02-10', folder: 'Presentations' },
    { id: '7', name: 'Design.png', size: 10 * 1024 * 1024, type: 'png', lastModified: '2023-02-15', folder: 'Design' },
    { id: '8', name: 'Data.csv', size: 15 * 1024 * 1024, type: 'csv', lastModified: '2023-02-20', folder: 'Data' },
    { id: '9', name: 'Memo.doc', size: 2 * 1024 * 1024, type: 'doc', lastModified: '2023-02-25', folder: 'Office' },
    { id: '10', name: 'Sketch.jpeg', size: 8 * 1024 * 1024, type: 'jpeg', lastModified: '2023-03-01', folder: 'Art' },
    { id: '11', name: 'Log.log', size: 3 * 1024 * 1024, type: 'log', lastModified: '2023-03-05', folder: 'Logs' },
    { id: '12', name: 'Script.js', size: 4 * 1024 * 1024, type: 'js', lastModified: '2023-03-10', folder: 'Code' },
  ];
};

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [categories, setCategories] = useState({ pdf: 0, docx: 0, xlsx: 0, jpg: 0, png: 0, jpeg: 0, other: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        const fetchedFiles = await fetchFiles();
        const recentFiles = fetchedFiles.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()).slice(0, 10);
        setFiles(recentFiles);

        const newCategories = fetchedFiles.reduce(
          (acc, file) => {
            if (file.type === 'pdf') acc.pdf++;
            else if (file.type === 'docx' || file.type === 'doc') acc.docx++;
            else if (file.type === 'xlsx' || file.type === 'csv') acc.xlsx++;
            else if (file.type === 'jpg' || file.type === 'png' || file.type === 'jpeg') acc.jpg++;
            else acc.other++;
            return acc;
          },
          { pdf: 0, docx: 0, xlsx: 0, jpg: 0, png: 0, jpeg: 0, other: 0 }
        );
        setCategories(newCategories);
      } catch (err) {
        setError('Failed to load files.');
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, []);

  // Handle file deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        setLoading(true);
        console.log('Deleting file with id:', id);
        const updatedFiles = await fetchFiles();
        const recentFiles = updatedFiles.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()).slice(0, 10);
        setFiles(recentFiles);

        const newCategories = updatedFiles.reduce(
          (acc, file) => {
            if (file.type === 'pdf') acc.pdf++;
            else if (file.type === 'docx' || file.type === 'doc') acc.docx++;
            else if (file.type === 'xlsx' || file.type === 'csv') acc.xlsx++;
            else if (file.type === 'jpg' || file.type === 'png' || file.type === 'jpeg') acc.jpg++;
            else acc.other++;
            return acc;
          },
          { pdf: 0, docx: 0, xlsx: 0, jpg: 0, png: 0, jpeg: 0, other: 0 }
        );
        setCategories(newCategories);
      } catch (err) {
        setError('Failed to delete file.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Mock folder data
  const folders = [
    { name: 'Documents', fileCount: 640 },
    { name: 'Work', fileCount: 150 },
    { name: 'Finance', fileCount: 200 },
    { name: 'Photos', fileCount: 300 },
    { name: 'Design', fileCount: 250 },
    { name: 'Office', fileCount: 180 },
    { name: 'Art', fileCount: 120 },
    { name: 'Code', fileCount: 90 },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#2d3748', padding: '1rem', fontFamily: 'Arial, sans-serif', backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.3)' }}>
      {/* File Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(235, 244, 255, 0.3)', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <FaFilePdf style={{ fontSize: '1rem', color: '#e53e3e', margin: '0 auto 0.25rem' }} />
          <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>PDF</h2>
          <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>{categories.pdf} Files</p>
          <div style={{ width: '100%', background: 'rgba(226, 232, 240, 0.2)', borderRadius: '9999px', height: '0.375rem', marginTop: '0.25rem' }}>
            <div style={{ width: `${(categories.pdf / (categories.pdf + categories.docx + categories.xlsx + categories.jpg + categories.other) * 100 || 0)}%`, background: 'linear-gradient(90deg, #e53e3e, #fc8181)', height: '0.375rem', borderRadius: '9999px' }}></div>
          </div>
          <p style={{ fontSize: '0.625rem', color: '#a0aec0', marginTop: '0.125rem' }}>Dynamic GB / 50 GB</p>
          <button style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.25rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
        </div>
        <div style={{ background: 'rgba(255, 245, 245, 0.3)', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <FaFileWord style={{ fontSize: '1rem', color: '#3182ce', margin: '0 auto 0.25rem' }} />
          <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>Word</h2>
          <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>{categories.docx} Files</p>
          <div style={{ width: '100%', background: 'rgba(226, 232, 240, 0.2)', borderRadius: '9999px', height: '0.375rem', marginTop: '0.25rem' }}>
            <div style={{ width: `${(categories.docx / (categories.pdf + categories.docx + categories.xlsx + categories.jpg + categories.other) * 100 || 0)}%`, background: 'linear-gradient(90deg, #3182ce, #63b3ed)', height: '0.375rem', borderRadius: '9999px' }}></div>
          </div>
          <p style={{ fontSize: '0.625rem', color: '#a0aec0', marginTop: '0.125rem' }}>Dynamic GB / 50 GB</p>
          <button style={{ color: '#3182ce', fontSize: '0.75rem', marginTop: '0.25rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
        </div>
        <div style={{ background: 'rgba(243, 232, 255, 0.3)', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <FaFileExcel style={{ fontSize: '1rem', color: '#38a169', margin: '0 auto 0.25rem' }} />
          <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>Excel</h2>
          <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>{categories.xlsx} Files</p>
          <div style={{ width: '100%', background: 'rgba(226, 232, 240, 0.2)', borderRadius: '9999px', height: '0.375rem', marginTop: '0.25rem' }}>
            <div style={{ width: `${(categories.xlsx / (categories.pdf + categories.docx + categories.xlsx + categories.jpg + categories.other) * 100 || 0)}%`, background: 'linear-gradient(90deg, #38a169, #68d391)', height: '0.375rem', borderRadius: '9999px' }}></div>
          </div>
          <p style={{ fontSize: '0.625rem', color: '#a0aec0', marginTop: '0.125rem' }}>Dynamic GB / 50 GB</p>
          <button style={{ color: '#38a169', fontSize: '0.75rem', marginTop: '0.25rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
        </div>
        <div style={{ background: 'rgba(245, 245, 245, 0.3)', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <FaFileImage style={{ fontSize: '1rem', color: '#9f7aea', margin: '0 auto 0.25rem' }} />
          <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>Images</h2>
          <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>{categories.jpg} Files</p>
          <div style={{ width: '100%', background: 'rgba(226, 232, 240, 0.2)', borderRadius: '9999px', height: '0.375rem', marginTop: '0.25rem' }}>
            <div style={{ width: `${(categories.jpg / (categories.pdf + categories.docx + categories.xlsx + categories.jpg + categories.other) * 100 || 0)}%`, background: 'linear-gradient(90deg, #9f7aea, #a3bffa)', height: '0.375rem', borderRadius: '9999px' }}></div>
          </div>
          <p style={{ fontSize: '0.625rem', color: '#a0aec0', marginTop: '0.125rem' }}>Dynamic GB / 50 GB</p>
          <button style={{ color: '#9f7aea', fontSize: '0.75rem', marginTop: '0.25rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
        </div>
        <div style={{ background: 'rgba(243, 232, 255, 0.3)', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <FaFile style={{ fontSize: '1rem', color: '#ed8936', margin: '0 auto 0.25rem' }} />
          <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#2d3748' }}>Others</h2>
          <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>{categories.other} Files</p>
          <div style={{ width: '100%', background: 'rgba(226, 232, 240, 0.2)', borderRadius: '9999px', height: '0.375rem', marginTop: '0.25rem' }}>
            <div style={{ width: `${(categories.other / (categories.pdf + categories.docx + categories.xlsx + categories.jpg + categories.other) * 100 || 0)}%`, background: 'linear-gradient(90deg, #ed8936, #f6ad55)', height: '0.375rem', borderRadius: '9999px' }}></div>
          </div>
          <p style={{ fontSize: '0.625rem', color: '#a0aec0', marginTop: '0.125rem' }}>Dynamic GB / 50 GB</p>
          <button style={{ color: '#ed8936', fontSize: '0.75rem', marginTop: '0.25rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
        </div>
      </div>

      {/* Folders */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>Recent Folders</h2>
        <button style={{ color: '#ed8936', fontSize: '0.75rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>See More</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
        {folders.map((folder, index) => (
          <div key={index} style={{ background: 'rgba(235, 244, 255, 0.3)', padding: '0.5rem', borderRadius: '0.375rem', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <FaFolder style={{ fontSize: '1rem', color: '#4299e1', margin: '0 auto 0.25rem' }} />
            <h3 style={{ fontSize: '0.75rem', fontWeight: '500', color: '#2d3748' }}>{folder.name}</h3>
            <p style={{ fontSize: '0.625rem', color: '#4a5568' }}>{folder.fileCount} Files</p>
          </div>
        ))}
      </div>

      {/* Files List */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#2d3748' }}>Recent Files</h2>
        <button style={{ color: '#ed8936', fontSize: '0.75rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>See More</button>
      </div>
      <div style={{ background: 'rgba(255, 255, 255, 0.3)', padding: '0.5rem', borderRadius: '0.375rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', fontSize: '0.75rem', fontWeight: '500', color: '#a0aec0', marginBottom: '0.25rem' }}>
          <div>Name</div>
          <div>Size</div>
          <div>Folder</div>
          <div>Last Modified</div>
          <div>Actions</div>
        </div>
        {loading && <p style={{ textAlign: 'center', color: '#4a5568', fontSize: '0.75rem' }}>Loading...</p>}
        {error && <p style={{ textAlign: 'center', color: '#e53e3e', fontSize: '0.75rem' }}>{error}</p>}
        {!loading && files.length === 0 && <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.75rem' }}>No files available.</p>}
        {!loading && files.map((file) => (
          <div key={file.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', alignItems: 'center', padding: '0.25rem 0', borderTop: '1px solid rgba(226, 232, 240, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaFile style={{ fontSize: '0.875rem', color: '#4299e1', marginRight: '0.25rem' }} />
              <span style={{ color: '#2d3748', fontSize: '0.75rem' }}>{file.name}</span>
            </div>
            <div style={{ color: '#4a5568', fontSize: '0.75rem' }}>{formatFileSize(file.size)}</div>
            <div style={{ color: '#4299e1', fontSize: '0.75rem' }}>{file.folder}</div>
            <div style={{ color: '#4a5568', fontSize: '0.75rem' }}>{file.lastModified}</div>
            <button
              onClick={() => handleDelete(file.id)}
              style={{ color: '#e53e3e', fontSize: '0.75rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;