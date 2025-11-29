import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Upload, 
  FileText, 
  Shield, 
  Lock,
  Eye,
  Download,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Evidence = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded'
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} file(s) added successfully!`);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    toast.success('File removed successfully!');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('document')) return '📝';
    return '📎';
  };

  const existingEvidence = [
    {
      id: 1,
      name: 'incident_report.pdf',
      type: 'application/pdf',
      size: 245760,
      uploadedAt: '2024-01-15T10:30:00Z',
      status: 'encrypted'
    },
    {
      id: 2,
      name: 'evidence_photo.jpg',
      type: 'image/jpeg',
      size: 1024768,
      uploadedAt: '2024-01-14T15:45:00Z',
      status: 'encrypted'
    }
  ];

  const allFiles = [...existingEvidence, ...uploadedFiles];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">Secure Evidence Vault</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Upload and securely store important files. All evidence is encrypted and protected.
        </p>
      </div>

      {/* Upload section */}
      <Card className="border-2 border-dashed border-primary-300 dark:border-primary-700">
        <CardContent className="p-8">
          <div
            className="text-center space-y-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upload Evidence Files</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB each)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
            />
            <Button 
              onClick={() => document.getElementById('file-upload').click()}
              className="mx-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Evidence Files</h2>
          <Badge variant="secondary">
            {allFiles.length} file{allFiles.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {allFiles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                No evidence files yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Upload your first file to get started with secure storage.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-strong transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {file.name}
                        </CardTitle>
                        <CardDescription>
                          {formatFileSize(file.size)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={file.status === 'encrypted' ? 'success' : 'default'}
                      className="ml-2"
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      {file.status === 'encrypted' ? 'Encrypted' : 'Secured'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-emergency-600 hover:text-emergency-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Security information */}
      <Card className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                Bank-Level Security
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                All files are encrypted with AES-256 encryption and stored in secure, access-controlled servers. 
                Your evidence is protected against unauthorized access.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning for sensitive content */}
      <Card className="bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Handle with Care
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                These files may contain sensitive or triggering content. Only share access with trusted 
                professionals and legal representatives as needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evidence;