import { TreeView } from 'twico-ui';

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Z" /></svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3v5h5" /><path d="M6 21V5a2 2 0 0 1 2-2h6l5 5v13H8a2 2 0 0 1-2-2Z" /></svg>
);

export const FileExplorer = () => (
  <div style={{ width: 300, maxWidth: '100%' }}>
    <TreeView
      defaultExpanded={['src', 'comp']}
      defaultSelectedId="btn"
      items={[
        { id: 'src', label: 'src', icon: <FolderIcon />, badge: 4, children: [
          { id: 'app', label: 'App.tsx', icon: <FileIcon /> },
          { id: 'comp', label: 'components', icon: <FolderIcon />, badge: 2, children: [
            { id: 'btn', label: 'Button.tsx', icon: <FileIcon /> },
            { id: 'tree', label: 'TreeView.tsx', icon: <FileIcon /> },
          ] },
        ] },
        { id: 'pkg', label: 'package.json', icon: <FileIcon /> },
        { id: 'readme', label: 'README.md', icon: <FileIcon /> },
      ]}
    />
  </div>
);

export const Mailboxes = () => (
  <div style={{ width: 300, maxWidth: '100%' }}>
    <TreeView
      defaultExpanded={['inbox']}
      items={[
        { id: 'inbox', label: 'Inbox', badge: 12, children: [
          { id: 'work', label: 'Work', badge: 5 },
          { id: 'social', label: 'Social', badge: 7 },
        ] },
        { id: 'drafts', label: 'Drafts', badge: 2 },
        { id: 'sent', label: 'Sent' },
      ]}
    />
  </div>
);
