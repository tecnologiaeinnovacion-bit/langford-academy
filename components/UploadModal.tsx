
import React, { useState } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const startUpload = () => {
    setUploading(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploading(false);
          setProgress(0);
          setFiles([]);
          alert('¡Materiales subidos exitosamente a Langford!');
          onClose();
        }, 1000);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Panel de Instructor: Subir Recursos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times"></i></button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="border-2 border-dashed border-blue-200 rounded-2xl p-10 text-center bg-blue-50/30 hover:bg-blue-50 transition-colors">
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange}
              className="hidden" 
              id="file-upload" 
              disabled={uploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <i className="fas fa-cloud-upload-alt text-5xl text-blue-500 mb-4 block"></i>
              <p className="font-bold text-gray-700">Haz clic para subir o arrastra archivos</p>
              <p className="text-xs text-gray-400 mt-2">Soporta videos MP4, Imágenes JPG/PNG y documentos PDF</p>
            </label>
          </div>

          {files.length > 0 && !uploading && (
            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-600">Archivos seleccionados:</p>
              {files.map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded border text-xs">
                  <span className="truncate">{f.name}</span>
                  <span className="text-gray-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
              <button 
                onClick={startUpload}
                className="w-full bg-blue-700 text-white font-bold py-3 rounded-xl mt-4"
              >
                Comenzar Carga
              </button>
            </div>
          )}

          {uploading && (
            <div className="space-y-4 text-center">
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-sm font-bold text-blue-700">Subiendo archivos... {progress}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
