import { useEffect, useRef, useState } from 'react';
import { fileService, type ProcessedDocument } from '../services/document-service';



export default function ProcessedDocuments() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<
    ProcessedDocument[]
  >([]);



  const [retryingId, setRetryingId] = useState<
    number | null
  >(null);

  const [error, setError] = useState<string | null>(
    null,
  );

  const loadDocuments = async () => {
    try {
      setError(null);

      const data =
        await fileService.getProcessedDocuments();

      setDocuments(data);
    } catch (error) {
      console.error(error);

      setError(
        'Unable to load processed documents.',
      );
    } finally {
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };



  const handleRetry = async (id: number) => {
    try {
      setRetryingId(id);
      setError(null);

      await fileService.retryDocument(id);

      await loadDocuments();
    } catch (error) {
      console.error(error);

      setError(
        'Unable to retry the document.',
      );
    } finally {
      setRetryingId(null);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
  
    if (!file) {
      return;
    }
  
    try {
      setError(null);
  
      console.log('Selected file:', file);
  
      await fileService.uploadDocument(file);
  
      await loadDocuments();
    } catch (error) {
      console.error('Upload failed:', error);
  
      setError('Unable to upload the document.');
    } finally {
      // Allow the user to select the same file again
      event.target.value = '';
    }
  };

  const formatDate = (
    date: string | null,
  ) => {
    if (!date) {
      return '—';
    }

    return new Date(date).toLocaleDateString();
  };

  const getFileName = (path: string) => {
    return path.split('/').pop() ?? path;
  };

  return (
<div className="processed-documents">
  <div className="processed-documents-container">

    <div className="documents-header">
      <div>
        <h1 className="documents-title">
          Processed Documents
        </h1>

        <p className="documents-description">
          View clinical files and its measurements.
        </p>
      </div>

      <button
        className="upload-button"
        onClick={handleUploadClick}
      >
        + Upload Document
      </button>
      <input
  ref={fileInputRef}
  type="file"
  accept=".pdf,image/*"
  style={{ display: 'none' }}
  onChange={handleFileChange}
/>
    </div>

    {error && (
      <div className="documents-error">
        {error}
      </div>
    )}

    <div className="documents-table-container">
      <table className="documents-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Blood Pressure</th>
            <th>HbA1c</th>
            <th>Status</th>
            <th>Processed</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((document) => (
            <tr key={document.id}>

              <td>
                <div className="document-info">
                  <div className="document-icon">
                    PDF
                  </div>

                  <div>
                    <p className="document-name">
                      {getFileName(document.path)}
                    </p>

                    <p className="document-id">
                      ID: {document.id}
                    </p>
                  </div>
                </div>
              </td>

              <td>
                {document.bp_measure ? (
                  <>
                    <p className="measurement-value">
                      {document.bp_measure}
                    </p>

                    <p className="measurement-date">
                      {formatDate(document.bp_measure_date)}
                    </p>
                  </>
                ) : (
                  <span className="empty-value">—</span>
                )}
              </td>

              <td>
                {document.a1c_measure ? (
                  <>
                    <p className="measurement-value">
                      {document.a1c_measure}
                    </p>

                    <p className="measurement-date">
                      {formatDate(document.a1c_measure_date)}
                    </p>
                  </>
                ) : (
                  <span className="empty-value">—</span>
                )}
              </td>

              <td>
                <span
                  className={`status ${
                    document.status === 'Success'
                      ? 'status-success'
                      : document.status === 'Processing'
                        ? 'status-processing'
                        : document.status === 'Needs Review'
                          ? 'status-review'
                          : 'status-failed'
                  }`}
                >
                  {document.status}
                </span>
              </td>

              <td>
                {formatDate(document.processing_date)}
              </td>

              <td>
                {(document.status === 'Failed' || document.status === 'Needs Review') && (
                  <button
                    className="retry-button"
                    disabled={retryingId === document.id}
                    onClick={() =>
                      handleRetry(document.id)
                    }
                  >
                    {retryingId === document.id
                      ? 'Retrying...'
                      : 'Retry'}
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>

  </div>
</div>
  );
}