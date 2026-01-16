import React, { useState } from 'react';
import { ArrowLeft, Upload, Camera } from 'lucide-react';
import { ReportSuccessModal } from './ReportSuccessModal';
import { useReports } from '../context/ReportsContext';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

const issueTypes = [
  'Missing Item',
  'Wrong Item',
  'Food Quality',
  'Packaging',
  'Staff Attitude',
  'Other'
];

export function ReportIssueModal({ isOpen, onClose, orderNumber }: ReportIssueModalProps) {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { addReport } = useReports();

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedIssue || !description.trim()) {
      alert('Please select an issue type and provide a description.');
      return;
    }
    
    // Add report to context
    addReport({
      orderNumber,
      issueTypes: [selectedIssue],
      description: description.trim(),
      imageUrl: uploadedImage || undefined
    });
    
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setSelectedIssue(null);
    setDescription('');
    setUploadedImage(null);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        overflow: 'auto'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '600px',
          minHeight: '100vh',
          backgroundColor: '#f9fafb',
          margin: '0 auto',
          paddingBottom: '140px'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #000000',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ArrowLeft style={{ width: '24px', height: '24px', color: '#1f2937' }} />
              </button>
              <h1 style={{
                fontSize: '16px',
                fontWeight: '400',
                color: '#101828',
                margin: '0 0 4px 0',
                letterSpacing: '-0.31px'
              }}>
                Report an Issue
              </h1>
            </div>
            <div>
              <p style={{
                fontSize: '16px',
                color: '#4a5565',
                margin: '0px 0px -5px -5px',
                textAlign: 'center',
                letterSpacing: '0.8px'

              }}>
                Order #{orderNumber}
              </p>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Issue Type Selection */}
            <div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{
                  fontSize: '16px',
                  color: '#101828',
                  letterSpacing: '-0.31px'
                }}>
                  What went wrong?
                </span>
                <span style={{ color: '#fb2c36', marginLeft: '4px' }}>*</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px'
              }}>
                {issueTypes.map((issue) => (
                  <button
                    key={issue}
                    onClick={() => setSelectedIssue(issue)}
                    style={{
                      padding: '12px',
                      backgroundColor: selectedIssue === issue ? '#27ae60' : '#ffffff',
                      color: selectedIssue === issue ? '#ffffff' : '#364153',
                      border: selectedIssue === issue ? '2px solid #27ae60' : '2px solid #d1d5dc',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: '400',
                      cursor: 'pointer',
                      letterSpacing: '-0.15px',
                      boxShadow: selectedIssue === issue ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedIssue !== issue) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedIssue !== issue) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{
                  fontSize: '16px',
                  color: '#101828',
                  letterSpacing: '-0.31px'
                }}>
                  Tell us more
                </span>
                <span style={{ color: '#fb2c36', marginLeft: '4px' }}>*</span>
              </div>
              <textarea
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setDescription(e.target.value);
                  }
                }}
                placeholder="Please describe the issue in detail so we can help you..."
                style={{
                  width: '100%',
                  height: '160px',
                  padding: '12px',
                  backgroundColor: '#f3f3f5',
                  border: '1px solid #d1d5dc',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#101828',
                  letterSpacing: '-0.31px',
                  resize: 'none',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.5'
                }}
              />
              <p style={{
                fontSize: '12px',
                color: '#6a7282',
                margin: '8px 0 0 0'
              }}>
                {description.length}/500 characters
              </p>
            </div>

            {/* Upload Photo */}
            <div>
              <div style={{ marginBottom: '16px' }}>
                <span style={{
                  fontSize: '16px',
                  color: '#101828',
                  letterSpacing: '-0.31px'
                }}>
                  Add Evidence
                </span>
                <span style={{
                  fontSize: '14px',
                  color: '#6a7282',
                  marginLeft: '8px',
                  letterSpacing: '-0.15px'
                }}>
                  (Optional)
                </span>
              </div>
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '34px',
                border: '2px solid #d1d5dc',
                borderRadius: '10px',
                cursor: 'pointer',
                backgroundColor: uploadedImage ? '#f0fdf4' : 'transparent'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {uploadedImage ? (
                  <>
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      style={{
                        width: '100%',
                        maxWidth: '200px',
                        height: 'auto',
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}
                    />
                    <p style={{
                      fontSize: '16px',
                      color: '#27ae60',
                      margin: 0,
                      letterSpacing: '-0.31px'
                    }}>
                      Photo uploaded ✓
                    </p>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px'
                    }}>
                      <Camera style={{ width: '24px', height: '24px', color: '#6b7280' }} />
                    </div>
                    <p style={{
                      fontSize: '16px',
                      color: '#364153',
                      margin: '0 0 8px 0',
                      letterSpacing: '-0.31px'
                    }}>
                      Upload Photo
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#6a7282',
                      margin: 0,
                      textAlign: 'center'
                    }}>
                      Tap to take a photo or choose from gallery
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Fixed Bottom Submit Button */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
          padding: '16px',
          boxShadow: '0 -10px 15px -3px rgba(0,0,0,0.1)',
          zIndex: 10000
        }}>
          <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              onClick={handleSubmit}
              disabled={!selectedIssue || !description.trim()}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: (!selectedIssue || !description.trim()) ? '#9ca3af' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: (!selectedIssue || !description.trim()) ? 'not-allowed' : 'pointer',
                letterSpacing: '-0.31px'
              }}
              onMouseEnter={(e) => {
                if (selectedIssue && description.trim()) {
                  e.currentTarget.style.backgroundColor = '#229954';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedIssue && description.trim()) {
                  e.currentTarget.style.backgroundColor = '#27ae60';
                }
              }}
            >
              Submit Report
            </button>
            <p style={{
              fontSize: '12px',
              color: '#6a7282',
              margin: 0,
              textAlign: 'center'
            }}>
              We usually respond within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <ReportSuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        orderNumber={orderNumber}
      />
    </>
  );
}
