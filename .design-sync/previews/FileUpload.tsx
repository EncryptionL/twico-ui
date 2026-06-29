import { FileUpload } from 'twico-ui';

export const Dropzone = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <FileUpload label="Project assets" multiple accept="image/*,.pdf" hint="PNG, JPG or PDF up to 10MB" />
  </div>
);

export const SingleFile = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <FileUpload label="Import data" accept=".csv" hint="One CSV file" />
  </div>
);

export const Required = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <FileUpload label="Resume" required accept=".pdf,.doc,.docx" tone="info" hint="Attach your resume (PDF or Word)." />
  </div>
);

export const ErrorState = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <FileUpload label="Avatar" accept="image/*" error="File must be under 2 MB." />
  </div>
);

export const Disabled = () => (
  <div style={{ width: 340, maxWidth: '100%' }}>
    <FileUpload label="Attachments" disabled hint="Uploads are paused." />
  </div>
);
