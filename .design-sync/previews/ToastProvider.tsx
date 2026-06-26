// @ds-preview generated 83ba57aefd2c — delete this line to keep your edits across re-syncs.
import { Toast, ToastProvider } from 'twico-ui';

export const Default = () => <ToastProvider><div data-ds-placeholder="" style={{padding:8,minHeight:40,maxWidth:'100%',overflow:'hidden',boxSizing:'border-box',border:'1px dashed #999',color:'#999',fontSize:12}}>{"ToastProvider content"}</div></ToastProvider>;

export const InToast = () => (
  <Toast>
    <ToastProvider><div data-ds-placeholder="" style={{padding:8,minHeight:40,maxWidth:'100%',overflow:'hidden',boxSizing:'border-box',border:'1px dashed #999',color:'#999',fontSize:12}}>{"ToastProvider content"}</div></ToastProvider>
  </Toast>
);
