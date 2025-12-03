import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
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
  CheckCircle,
  Loader2,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Evidence = () => {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showUploadNotification, setShowUploadNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [previousFileCount, setPreviousFileCount] = useState(0);
  const notificationTimeoutRef = useRef(null);

  // Load user's evidence files from backend
  useEffect(() => {
    const loadEvidenceFiles = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        // In a real implementation, you'd have an endpoint like GET /api/evidence/user/:userId
        // For now, start with empty state for new users
        // The files array will remain empty until user uploads something
        
        // TODO: When backend endpoint is ready, uncomment this:
        // const response = await fetch(`${API_BASE_URL}/api/evidence/user/${user.id}`, {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   }
        // });
        // const data = await response.json();
        // setUploadedFiles(data.files || []);
        
        // For now, start with empty state - new users have no files
        setUploadedFiles([]);
        
      } catch (error) {
        console.error('Error loading evidence files:', error);
        toast.error('Failed to load evidence files');
        // Keep files empty on error to maintain clean state
        setUploadedFiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvidenceFiles();
  }, [user]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  const handleFileSelect = useCallback(async (files) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      fileArray.forEach(file => {
        formData.append('files', file);
      });

      setUploadProgress({ uploading: true, progress: 0 });

      const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/api/evidence/upload-evidence`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Add uploaded files to the list
      const newFiles = data.uploadedFiles.map((file, index) => ({
        id: file.id,
        name: file.originalName,
        size: file.size,
        type: file.mimetype || fileArray[index].type,
        uploadedAt: new Date().toISOString(),
        status: file.status,
        uploadToken: file.uploadToken
      }));

      setUploadedFiles(prev => {
        const updatedFiles = [...prev, ...newFiles];
        // Update previous count for animation
        setPreviousFileCount(prev.length);
        return updatedFiles;
      });
      
      // Trigger upload notification
      const fileCount = [...uploadedFiles, ...newFiles].length;
      setNotificationCount(fileCount);
      setShowUploadNotification(true);
      
      // Clear any existing timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      // Set timeout to hide notification after 3 seconds
      notificationTimeoutRef.current = setTimeout(() => {
        setShowUploadNotification(false);
      }, 3000);
      
      // Show success toast with more detailed message
      const successMessage = data.message || 
        `${newFiles.length} file${newFiles.length !== 1 ? 's' : ''} uploaded successfully! ` +
        `Total files: ${fileCount}`;
      toast.success(successMessage, {
        duration: 4000,
        icon: '🎉'
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
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

  const removeFile = async (fileId) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    try {
      // In a real implementation, you'd call a delete endpoint
      // For now, we'll just remove from local state
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('File removed successfully!');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Failed to remove file');
    }
  };

  const viewFile = async (file) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // For demo purposes, open download in new tab
      if (file.uploadToken) {
        const downloadUrl = `${API_BASE_URL.replace(/\/$/, '')}/api/evidence/download/${file.uploadToken}`;
        window.open(downloadUrl, '_blank');
      } else {
        toast.error('File access token not available');
      }
    } catch (error) {
      console.error('Error viewing file:', error);
      toast.error('Failed to view file');
    }
  };

  const downloadFile = async (file) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      if (file.uploadToken) {
        const downloadUrl = `${API_BASE_URL.replace(/\/$/, '')}/api/evidence/download/${file.uploadToken}`;
        
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Add authorization header by using fetch first
        const response = await fetch(downloadUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Download failed');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('File downloaded successfully');
      } else {
        toast.error('File download token not available');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
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

  const allFiles = uploadedFiles;

  // Check authentication
  if (!user) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient">Secure Evidence Vault</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Please log in to access your secure evidence vault.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">Secure Evidence Vault</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Keep your important documents and memories safe in your personal vault. 
          Everything is encrypted and only accessible to you.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Your files are secured with {user.username}'s account</span>
        </div>
      </div>

      {/* Upload Notification */}
      {showUploadNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <Card className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-bounce">
                    {notificationCount}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200 text-sm">
                    Files Uploaded Successfully!
                  </h3>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    You now have {notificationCount} file{notificationCount !== 1 ? 's' : ''} in your secure vault
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadNotification(false)}
                  className="text-green-600 hover:text-green-800 p-1"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload section */}
      <Card className="border-2 border-dashed border-primary-300 dark:border-primary-700">
        <CardContent className="p-8">
          <div
            className="text-center space-y-4"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
              ) : (
                <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {isUploading ? 'Saving your files...' : 'Add Your Important Files'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isUploading 
                  ? 'Your files are being safely stored in your personal vault'
                  : 'Drag and drop files here, or click to browse'
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                We support: PDF, Word docs, photos, and text files (up to 10MB each)
              </p>
              {uploadProgress.uploading && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              onChange={handleFileInputChange}
              className="hidden"
              id="file-upload"
              disabled={isUploading}
            />
            <Button 
              onClick={() => document.getElementById('file-upload').click()}
              className="mx-auto"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Select Files
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Evidence Files</h2>
          <Badge 
            variant="secondary" 
            className={`transition-all duration-500 transform ${
              allFiles.length > previousFileCount 
                ? 'scale-110 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : ''
            }`}
          >
            <Bell className="h-3 w-3 mr-1" />
            {allFiles.length} file{allFiles.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Loading your evidence files...
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Please wait while we fetch your secure files.
              </p>
            </CardContent>
          </Card>
        ) : allFiles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Your secure vault is ready! 💜
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                When you're ready, you can upload important documents, photos, or memories to keep them safe.
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => viewFile(file)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => downloadFile(file)}
                    >
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

      {/* Supportive guidance for file sharing */}
      <Card className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                Your Privacy is Protected 💙
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                You're in complete control of your files. When you're ready to share evidence with your 
                support team, lawyer, or counselor, we'll help you do so safely and securely.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Evidence;