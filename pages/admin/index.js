import { useState, useEffect } from 'react';
import Head from 'next/head';

const STATUS_OPTIONS = [
  { value: 'live', label: '● 已上线' },
  { value: 'soon', label: '○ 即将上线' },
];

const EMPTY_FORM = { name: '', description: '', url: '', tags: '', status: 'live', icon_url: '', cover_url: '' };

function apiHeaders(password) {
  return { 'Content-Type': 'application/json', 'x-admin-password': password };
}

/* ── Input component ── */
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 500, letterSpacing: '0.04em' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'var(--bg3)', border: '1px solid var(--border)',
  borderRadius: 8, color: 'var(--text)', fontSize: 14,
  fontFamily: 'Sora, sans-serif', outline: 'none',
  transition: 'border-color 0.2s',
};

/* ── Modal ── */
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Game Form ── */
function GameForm({ initial = EMPTY_FORM, onSave, onCancel, loading }) {
  const [form, setForm] = useState({ ...initial, tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : initial.tags || '' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <Field label="游戏名称 *">
        <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)}
          onFocus={e => e.target.style.borderColor = 'var(--purple)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} placeholder="e.g. Drysland" />
      </Field>
      <Field label="描述">
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.description}
          onChange={e => set('description', e.target.value)}
          onFocus={e => e.target.style.borderColor = 'var(--purple)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
          placeholder="一句话描述游戏内容" />
      </Field>
      <Field label="游戏链接">
        <input style={inputStyle} value={form.url} onChange={e => set('url', e.target.value)}
          onFocus={e => e.target.style.borderColor = 'var(--purple)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
          placeholder="https://..." />
      </Field>
      <Field label="图标链接（icon_url）">
        <input style={inputStyle} value={form.icon_url || ''} onChange={e => set('icon_url', e.target.value)}
          onFocus={e => e.target.style.borderColor = 'var(--purple)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
          placeholder="https://.../icon.png" />
      </Field>
      <Field label="封面链接（cover_url）">
        <input style={inputStyle} value={form.cover_url || ''} onChange={e => set('cover_url', e.target.value)}
          onFocus={e => e.target.style.borderColor = 'var(--purple)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
          placeholder="https://.../cover.jpg" />
      </Field>
      <Field label="标签（逗号分隔）">
        <input style={inputStyle} value={form.tags} onChange={e => set('tags', e.target.value)}
          onFocus={e => e.target.style.borderColor = 'var(--purple)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
          placeholder="WebGL, 3D, 探索" />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        <Field label="状态">
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => set('status', e.target.value)}>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ padding: '9px 20px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text2)', fontSize: 13, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>取消</button>
        <button onClick={() => onSave({ ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) })}
          disabled={loading} style={{ padding: '9px 20px', background: 'var(--purple)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,sans-serif', opacity: loading ? 0.6 : 1 }}>
          {loading ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}

/* ── Row ── */
function GameRow({ game, onEdit, onDelete, onMove, isFirst, isLast }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 10, transition: 'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
      {/* Icon */}
      <div style={{ width: 28, height: 28, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
        {game.icon_url ? (
          <img src={game.icon_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : null}
      </div>
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>{game.name}</span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, fontWeight: 600,
            ...(game.status === 'live'
              ? { background: 'rgba(16,185,129,0.12)', color: '#10B981' }
              : { background: 'rgba(255,255,255,0.05)', color: 'var(--text3)' }) }}>
            {game.status === 'live' ? 'LIVE' : 'SOON'}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {game.url || '—'}
        </div>
      </div>
      {/* Tags */}
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        {(game.tags || []).slice(0, 2).map(t => (
          <span key={t} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: 'rgba(139,92,246,0.1)', color: 'var(--purple2)' }}>{t}</span>
        ))}
      </div>
      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button onClick={() => onMove(-1)} disabled={isFirst} title="上移" style={{ ...iconBtn, opacity: isFirst ? 0.25 : 1 }}>↑</button>
        <button onClick={() => onMove(1)} disabled={isLast}  title="下移" style={{ ...iconBtn, opacity: isLast  ? 0.25 : 1 }}>↓</button>
        <button onClick={onEdit} title="编辑" style={iconBtn}>✎</button>
        <button onClick={async () => {
          if (!confirm(`确认删除「${game.name}」？`)) return;
          setDeleting(true); await onDelete(); setDeleting(false);
        }} title="删除" style={{ ...iconBtn, color: '#EF4444' }}>{deleting ? '…' : '✕'}</button>
      </div>
    </div>
  );
}

const iconBtn = {
  width: 30, height: 30, borderRadius: 7, background: 'transparent',
  border: '1px solid var(--border)', color: 'var(--text2)',
  fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'Sora,sans-serif', transition: 'background 0.15s, border-color 0.15s',
};

/* ── Main Admin Page ── */
export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [games, setGames] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [modal, setModal] = useState(null); // null | 'add' | {game}
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  async function login() {
    setAuthLoading(true); setAuthError('');
    const res = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    if (res.ok) { setAuthed(true); sessionStorage.setItem('admpw', password); }
    else setAuthError('密码错误，请重试');
    setAuthLoading(false);
  }

  async function loadGames() {
    setFetching(true);
    const res = await fetch('/api/games');
    if (res.ok) setGames(await res.json());
    setFetching(false);
  }

  useEffect(() => {
    const saved = sessionStorage.getItem('admpw');
    if (saved) { setPassword(saved); setAuthed(true); }
  }, []);

  useEffect(() => { if (authed) loadGames(); }, [authed]);

  async function handleSave(form) {
    setSaving(true);
    const isEdit = modal && modal.id;
    const url = isEdit ? `/api/games/${modal.id}` : '/api/games';
    const method = isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: apiHeaders(password), body: JSON.stringify(form) });
    if (res.ok) { await loadGames(); setModal(null); showToast(isEdit ? '已更新 ✓' : '已添加 ✓'); }
    else { const e = await res.json(); showToast('错误: ' + e.error); }
    setSaving(false);
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/games/${id}`, { method: 'DELETE', headers: apiHeaders(password) });
    if (res.ok) { await loadGames(); showToast('已删除 ✓'); }
    else showToast('删除失败');
  }

  async function handleMove(index, dir) {
    const next = [...games];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    // Update sort_order for both
    await Promise.all([
      fetch(`/api/games/${next[index].id}`, { method: 'PUT', headers: apiHeaders(password), body: JSON.stringify({ sort_order: index + 1 }) }),
      fetch(`/api/games/${next[target].id}`, { method: 'PUT', headers: apiHeaders(password), body: JSON.stringify({ sort_order: target + 1 }) }),
    ]);
    await loadGames();
  }

  /* ── Login Screen ── */
  if (!authed) {
    return (
      <>
        <Head><title>Admin — FlameGames</title></Head>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', fontFamily: 'Sora,sans-serif' }}>
          <div style={{ width: 360, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 40 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Flame<span style={{ color: 'var(--purple2)' }}>Games</span></div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>管理员登录</div>
            </div>
            <Field label="管理员密码">
              <input type="password" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                onFocus={e => e.target.style.borderColor = 'var(--purple)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}
                placeholder="输入密码" autoFocus />
            </Field>
            {authError && <div style={{ fontSize: 12, color: '#EF4444', marginBottom: 12 }}>{authError}</div>}
            <button onClick={login} disabled={authLoading} style={{ width: '100%', padding: '11px 0', background: 'var(--purple)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,sans-serif', opacity: authLoading ? 0.7 : 1 }}>
              {authLoading ? '验证中...' : '登录 →'}
            </button>
          </div>
        </div>
      </>
    );
  }

  /* ── Admin Dashboard ── */
  const liveCount = games.filter(g => g.status === 'live').length;

  return (
    <>
      <Head><title>Admin — FlameGames</title></Head>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'Sora,sans-serif' }}>

        {/* Toast */}
        {toast && (
          <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 300, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px', fontSize: 13, color: 'var(--text)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>{toast}</div>
        )}

        {/* Modal */}
        {modal && (
          <Modal title={modal === 'add' ? '添加游戏' : `编辑：${modal.name}`} onClose={() => setModal(null)}>
            <GameForm initial={modal === 'add' ? EMPTY_FORM : modal} onSave={handleSave} onCancel={() => setModal(null)} loading={saving} />
          </Modal>
        )}

        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)', padding: '18px 0', background: 'rgba(8,8,14,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Flame<span style={{ color: 'var(--purple2)' }}>Games</span></span>
              <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 999, background: 'rgba(139,92,246,0.1)', color: 'var(--purple2)', fontWeight: 600 }}>ADMIN</span>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <a href="/" target="_blank" style={{ fontSize: 12, color: 'var(--text3)', textDecoration: 'none' }}>查看前端 ↗</a>
              <button onClick={() => { sessionStorage.removeItem('admpw'); setAuthed(false); setPassword(''); }}
                style={{ fontSize: 12, padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 7, color: 'var(--text3)', cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>退出登录</button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 28px' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 36 }}>
            {[
              { label: '游戏总数', value: games.length },
              { label: '已上线',   value: liveCount },
              { label: '即将上线', value: games.length - liveCount },
            ].map(s => (
              <div key={s.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Games list header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>游戏列表</h2>
            <button onClick={() => setModal('add')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--purple)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Sora,sans-serif' }}>
              + 添加游戏
            </button>
          </div>

          {fetching ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: 40 }}>加载中...</div>
          ) : games.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: 60, background: 'var(--bg2)', borderRadius: 12, border: '1px dashed var(--border)' }}>
              还没有游戏，点击「添加游戏」开始吧
            </div>
          ) : (
            games.map((game, i) => (
              <GameRow key={game.id} game={game}
                isFirst={i === 0} isLast={i === games.length - 1}
                onEdit={() => setModal(game)}
                onDelete={() => handleDelete(game.id)}
                onMove={dir => handleMove(i, dir)} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
