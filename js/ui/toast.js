// ============================================================
// HIVE GALAXY — js/ui/toast.js
// Toast notifikacije
// ============================================================

// Dodaj CSS animacije
const _toastStyle = document.createElement('style');
_toastStyle.textContent = `
  @keyframes toastIn  { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes toastOut { to   { opacity:0; transform:translateX(20px); } }
  .toast-msg {
    background: #0c1428;
    border: 1px solid rgba(0,212,255,0.3);
    border-radius: 6px;
    padding: 8px 16px;
    margin-bottom: 6px;
    font-size: 0.8rem;
    font-family: 'Rajdhani', sans-serif;
    color: #b0cce8;
    animation: toastIn 0.2s ease, toastOut 0.3s ease 2.7s forwards;
    min-width: 220px;
  }
  .toast-ok   { border-color: rgba(0,255,136,0.4);  color: #00ff88; }
  .toast-err  { border-color: rgba(255,51,85,0.4);   color: #ff3355; }
  .toast-warn { border-color: rgba(255,204,68,0.4);  color: #ffcc44; }
  .toast-inf  { border-color: rgba(0,212,255,0.4);   color: #00d4ff; }
`;
document.head.appendChild(_toastStyle);

function toast(msg, type = 'inf') {
  const area = document.getElementById('toast-area');
  if (!area) return;
  const t = document.createElement('div');
  t.className = `toast-msg toast-${type}`;
  t.textContent = msg;
  area.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}