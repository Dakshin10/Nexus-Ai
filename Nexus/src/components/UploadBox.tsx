import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, Check, Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadBoxProps {
  onUpload: (files: File[]) => void;
  isProcessing?: boolean;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
      onUpload(newFiles);
    }
  }, [onUpload]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-10 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center overflow-hidden",
          isDragging ? "border-primary bg-primary/5 scale-[0.99]" : "border-white/10 hover:border-white/20 bg-white/5",
          isProcessing && "pointer-events-none opacity-50"
        )}
      >
        <div className={cn(
          "p-4 rounded-full bg-white/5 text-muted-foreground transition-all duration-500",
          isDragging && "scale-110 text-primary rotate-12"
        )}>
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-bold">Drop your documents here</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            Upload PDF, Markdown, or Exported Notion files for deep cognitive processing.
          </p>
        </div>

        <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors">
          Select Files
        </button>

        {isDragging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex items-center gap-3 text-primary font-bold">
              <Check className="w-6 h-6" /> Ready to ingest
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {files.map((file, i) => (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 glass rounded-xl border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(i)}
                  className="p-1 hover:bg-white/10 rounded-md transition-colors text-muted-foreground hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
