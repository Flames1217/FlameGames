import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function GamePage({ game }) {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  if (!game) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#08080E', color: '#fff', fontFamily: 'Sora, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
          <div style={{ color: '#666', marginBottom: 24 }}>游戏不存在或已下线</div>
          <a href="/" style={{ color: '#8B5CF6', textDecoration: 'none', fontSize: 14 }}>← 返回游戏列表</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{game.name} — FlameGames</title>
        <meta name="description" content={game.description} />
      </Head>

      {/* Top bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 44,
        background: 'rgba(8,8,14,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        gap: 16,
      }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            color: '#fff',
            cursor: 'pointer',
            padding: '4px 12px',
            fontSize: 12,
            fontFamily: 'Sora, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          ← 返回
        </button>

        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: 'Sora, sans-serif' }}>
          {game.name}
        </span>

        <div style={{ flex: 1 }} />

        <a
          href={game.url}
          target="_blank"
          rel="noreferrer"
          style={{
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 6,
            color: '#A78BFA',
            textDecoration: 'none',
            padding: '4px 12px',
            fontSize: 12,
            fontFamily: 'Sora, sans-serif',
          }}
        >
          新窗口打开 ↗
        </a>
      </div>

      {/* Loading overlay */}
      {!loaded && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: '#08080E',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 16,
          paddingTop: 44,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            border: '2px solid rgba(139,92,246,0.2)',
            borderTopColor: '#8B5CF6',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: 13, color: '#666', fontFamily: 'Sora, sans-serif' }}>
            正在加载 {game.name}...
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* iframe */}
      <iframe
        src={game.url}
        onLoad={() => setLoaded(true)}
        style={{
          position: 'fixed',
          top: 44,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: 'calc(100vh - 44px)',
          border: 'none',
          background: '#000',
        }}
        allow="fullscreen"
        title={game.name}
      />
    </>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { sql } = await import('../../lib/db');
    const rows = await sql`SELECT * FROM games WHERE slug = ${params.slug} LIMIT 1`;
    if (!rows.length) return { props: { game: null } };
    return { props: { game: JSON.parse(JSON.stringify(rows[0])) } };
  } catch {
    return { props: { game: null } };
  }
}
