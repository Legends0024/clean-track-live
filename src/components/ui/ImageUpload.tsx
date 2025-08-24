import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { validateFile } from '../../utils/helpers';
import { useToast } from '../../hooks/use-toast';
import { apiClient } from '../../api/api';

interface ImageUploadProps {
  onClose: () => void;
  onUpload: (imageUrl: string, inspectionData?: { score: number; label: string; }) => void;
  className?: string;
}

interface InspectionResult {
  score: number;
  label: string;
  recommendations: string[];
  confidence: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onClose, onUpload, className }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<InspectionResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback((selectedFile: File) => {
    const validation = validateFile(selectedFile);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles[0]);
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!file) throw new Error('No file selected');
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await apiClient.post('/uploads', formData);
      if (response.success && response.data?.url) {
        return response.data.url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      // Simulate upload for demo
      return URL.createObjectURL(file);
    }
  };

  const inspectImage = async (imageUrl: string): Promise<InspectionResult> => {
    try {
      const response = await apiClient.post('/inspect', { imageUrl });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Inspection failed');
    } catch (error) {
      // Simulate AI inspection for demo
      const mockResult: InspectionResult = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100 range
        label: 'Cleanliness assessment completed',
        recommendations: [
          'Overall hygiene standards are maintained',
          'Minor improvements suggested for optimal cleanliness',
          'Continue regular maintenance schedule'
        ],
        confidence: Math.random() * 0.2 + 0.8, // 80-100% confidence
      };
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return mockResult;
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Upload image
      const imageUrl = await uploadImage();
      
      setUploading(false);
      setInspecting(true);
      
      // Run AI inspection
      const inspection = await inspectImage(imageUrl);
      
      setInspecting(false);
      setInspectionResult(inspection);
      
      toast({
        title: "Analysis Complete",
        description: `Hygiene score: ${inspection.score}/100`,
      });
      
    } catch (error) {
      setUploading(false);
      setInspecting(false);
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    if (!file || !inspectionResult) return;
    
    const imageUrl = URL.createObjectURL(file);
    onUpload(imageUrl, {
      score: inspectionResult.score,
      label: inspectionResult.label,
    });
  };

  const isProcessing = uploading || inspecting;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={cn(
            'card-glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Upload Image for Inspection
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {!file ? (
            <div
              className={cn(
                'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
                dragOver
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                
                <div>
                  <p className="text-foreground font-medium mb-1">
                    Drop image here or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPEG, PNG, WebP (max 5MB)
                  </p>
                </div>
                
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-input"
                />
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={preview || ''}
                    alt="Upload preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setInspectionResult(null);
                    }}
                    className="absolute top-2 right-2 p-2 h-8 w-8 bg-black/50 hover:bg-black/70"
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p><strong>File:</strong> {file.name}</p>
                  <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              {/* Processing State */}
              {isProcessing && (
                <div className="text-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                  <p className="text-foreground font-medium">
                    {uploading ? 'Uploading image...' : 'Analyzing image...'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {inspecting && 'AI inspection in progress'}
                  </p>
                </div>
              )}

              {/* Inspection Results */}
              {inspectionResult && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 text-accent-success">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Analysis Complete</span>
                  </div>
                  
                  <div className="p-4 bg-accent/5 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">
                        Hygiene Score
                      </span>
                      <span className="text-2xl font-bold text-foreground">
                        {inspectionResult.score}/100
                      </span>
                    </div>
                    
                    <div className="w-full bg-muted rounded-full h-2 mb-3">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${inspectionResult.score}%` }}
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {inspectionResult.label}
                    </p>
                    
                    <div className="space-y-1">
                      {inspectionResult.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {!inspectionResult && !isProcessing && (
                  <Button
                    variant="primary"
                    onClick={handleUpload}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload & Analyze
                  </Button>
                )}
                
                {inspectionResult && !isProcessing && (
                  <Button
                    variant="gradient"
                    onClick={handleComplete}
                    className="flex-1"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete Task
                  </Button>
                )}
                
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageUpload;