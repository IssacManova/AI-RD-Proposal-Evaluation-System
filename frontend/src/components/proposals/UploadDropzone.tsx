import { useCallback, useRef, useState } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
  disabled?: boolean;
}

const MAX_MB = 10;

export default function UploadDropzone({ onFileSelect, selectedFile, onClear, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.pdf')) return 'Only PDF files are accepted.';
    if (file.size > MAX_MB * 1024 * 1024) return `File must be under ${MAX_MB} MB.`;
    return null;
  }, []);

  const handleFile = useCallback((file: File) => {
    const err = validate(file);
    if (err) { setError(err); return; }
    setError(null);
    onFileSelect(file);
  }, [validate, onFileSelect]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (selectedFile) {
    const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
    return (
      <div className="border-2 border-primary-200 bg-primary-50 rounded-2xl p-6 flex items-center gap-4 animate-fade-in">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <File className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{sizeMB} MB · PDF Document</p>
        </div>
        {!disabled && (
          <button onClick={onClear} className="btn-ghost text-slate-400 hover:text-rose-500 p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4
          cursor-pointer transition-all duration-200
          ${dragging ? 'border-primary-500 bg-primary-50 scale-[1.01]' : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragging ? 'bg-primary-100' : 'bg-slate-100'}`}>
          <UploadCloud className={`w-8 h-8 transition-colors ${dragging ? 'text-primary-600' : 'text-slate-400'}`} />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">
            {dragging ? 'Drop your PDF here' : 'Drag & drop your proposal PDF'}
          </p>
          <p className="text-xs text-slate-400 mt-1">or click to browse · Max {MAX_MB} MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={onInputChange}
          disabled={disabled}
        />
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-rose-600 text-xs">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
