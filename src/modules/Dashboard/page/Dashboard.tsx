import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFolder, FaFile, FaFilePowerpoint } from 'react-icons/fa';

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: string;
  folder: string;
}

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
  const [categories, setCategories] = useState({ pdf: 0, docx: 0, xlsx: 0, pptx: 0, jpg: 0, other: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        const fetchedFiles = await fetchFiles();
        const recentFiles = fetchedFiles
          .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
          .slice(0, 10);
        setFiles(recentFiles);

        const counts = { pdf: 0, docx: 0, xlsx: 0, pptx: 0, jpg: 0, other: 0 };
        for (const file of fetchedFiles) {
          if (file.type === 'pdf') counts.pdf++;
          else if (['docx', 'doc'].includes(file.type)) counts.docx++;
          else if (['xlsx', 'csv'].includes(file.type)) counts.xlsx++;
          else if (['pptx'].includes(file.type)) counts.pptx++;
          else if (['jpg', 'jpeg', 'png'].includes(file.type)) counts.jpg++;
          else counts.other++;
        }
        setCategories(counts);
      } catch {
        setError('Failed to load files.');
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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

  const categoryList = [
    { label: 'PDF', key: 'pdf', icon: <FaFilePdf />, gradient: 'linear-gradient(135deg,rgb(255, 14, 14),rgb(253, 108, 120))' },
    { label: 'Word', key: 'docx', icon: <FaFileWord />, gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)' },
    { label: 'Excel', key: 'xlsx', icon: <FaFileExcel />, gradient: 'linear-gradient(135deg, #059669, #10b981)' },
    { label: 'PowerPoint', key: 'pptx', icon: <FaFilePowerpoint />, gradient: 'linear-gradient(135deg, #dc2626, #f97316)' },
    { label: 'Images', key: 'jpg', icon: <FaFileImage />, gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)' },
    { label: 'Others', key: 'other', icon: <FaFile />, gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Category Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {categoryList.map(({ label, key, icon, gradient }) => (
          <div
            key={key}
            style={{
              background: `${gradient}, rgba(255, 255, 255, 0.1)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '1rem',
              borderRadius: '0.75rem',
              textAlign: 'center',
              color: '#fff',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              transform: 'scale(1)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}></div>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>{icon}</div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{label}</h3>
            <p style={{ fontSize: '0.75rem', opacity: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{categories[key as keyof typeof categories]} Files</p>
          </div>
        ))}
      </div>

      {/* Folders Section */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1f2937' }}>Recent Folders</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {folders.map((folder, idx) => (
          <div
            key={idx}
            style={{
              background: '#fff',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
          >
            <FaFolder style={{ fontSize: '1.25rem', color: '#3b82f6', marginBottom: '0.4rem' }} />
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.2rem' }}>{folder.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{folder.fileCount} Files</div>
          </div>
        ))}
      </div>

      {/* Recent Files Section */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1f2937' }}>Recent Files</h2>
      <div style={{
        background: '#fff',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#6b7280',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          <div>Name</div>
          <div>Size</div>
          <div>Folder</div>
          <div>Last Modified</div>
        </div>

        {loading && <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6b7280' }}>Loading...</div>}
        {error && <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#ef4444' }}>{error}</div>}

        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => alert(`You clicked on: ${file.name}`)}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              fontSize: '0.8rem',
              padding: '0.6rem 0',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              alignItems: 'center',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              borderRadius: '0.25rem',
              margin: '0 -0.25rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.transform = 'scale(1.005)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.25rem' }}>
              <FaFile color="#3b82f6" style={{ fontSize: '0.9rem' }} />
              <span style={{ fontWeight: 500, color: '#1f2937' }}>{file.name}</span>
            </div>
            <div style={{ color: '#6b7280', fontWeight: 400 }}>{formatFileSize(file.size)}</div>
            <div style={{ color: '#6b7280', fontWeight: 400 }}>{file.folder}</div>
            <div style={{ color: '#6b7280', fontWeight: 400 }}>{file.lastModified}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;