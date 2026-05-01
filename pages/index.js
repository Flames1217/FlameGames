import { useEffect, useState } from 'react';
import Head from 'next/head';

function GameCard({ game }) {
  const isLive = game.status === 'live';

  return (
    <a
      href={isLive ? `/${game.slug}` : undefined}
      target={undefined}
      rel="noreferrer"
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'var(--bg2)', border: `1px solid var(--border)`,
        borderRadius: 16, overflow: 'hidden',
        transition: 'transform 0.3s, border-color 0.3s, box-shadow 0.3s',
        cursor: isLive ? 'pointer' : 'default',
        textDecoration: 'none', color: 'inherit',
      }}
      onMouseEnter={e => {
        if (!isLive) return;
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
        e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.borderColor = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: 180, position: 'relative' }}>
        {game.cover_url ? (
          <img
            src={game.cover_url}
            alt={`${game.name} cover`}
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a1030,#0d0820)' }} />
        )}
        <span style={{
          position: 'absolute', top: 14, right: 14,
          fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
          padding: '4px 10px', borderRadius: 999,
          ...(isLive
            ? { background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }
            : { background: 'rgba(255,255,255,0.05)', color: 'var(--text3)', border: '1px solid var(--border)' })
        }}>
          {isLive ? '● LIVE' : '即将上线'}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 22px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(game.tags || []).map(tag => (
            <span key={tag} style={{
              fontSize: 11, padding: '3px 9px', borderRadius: 999, fontWeight: 500,
              background: 'rgba(139,92,246,0.12)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)'
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {game.icon_url ? (
            <div style={{ width: 34, height: 34, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.04)', flexShrink: 0 }}>
              <img src={game.icon_url} alt={`${game.name} icon`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          ) : null}
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em' }}>{game.name}</div>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, flex: 1 }}>{game.description}</p>
        <div style={{ marginTop: 6 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: '8px 18px',
            borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
            ...(isLive ? { background: '#8B5CF6', color: '#fff' } : { background: 'rgba(255,255,255,0.06)', color: 'var(--text3)' }),
          }}>
            {isLive ? '进入游戏 →' : '敬请期待'}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function Home({ initialGames }) {
  const [games, setGames] = useState(initialGames || []);

  // Refresh periodically (or you can use SWR)
  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch('/api/games');
      if (res.ok) setGames(await res.json());
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Head>
        <title>FlameGames - 浏览器里的休闲游戏合集</title>
        <meta name="description" content="一个随时随地都能打开玩的个人游戏合集，无需安装，打开浏览器就能开始。" />
      </Head>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139,92,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.04) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'rgba(139,92,246,0.1)', filter: 'blur(120px)', top: -200, left: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(34,211,238,0.06)', filter: 'blur(100px)', bottom: -100, right: -100 }} />
      </div>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 0', borderBottom: '1px solid var(--border)', background: 'rgba(8,8,14,0.85)', backdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.03em' }}>
            Flame<span style={{ color: 'var(--purple2)' }}>Games</span>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text3)' }}>{games.filter(g => g.status === 'live').length} 款游戏可玩</span>
          </div>
        </div>
      </nav>

      <main style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section style={{ padding: '160px 0 80px', textAlign: 'center' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 999, background: 'rgba(139,92,246,0.08)', fontSize: 12, color: 'var(--purple2)', fontWeight: 500, marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block' }} />
              随时打开，随手玩一局
            </div>
            <h1 style={{ fontSize: 'clamp(38px,6vw,68px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: 20 }}>
              打开浏览器，<br />
              <span className="gradient-text">玩点有趣的</span>
            </h1>
            <p style={{ fontSize: 17, color: 'var(--text2)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.75 }}>
              FlameGames 是我的个人游戏合集。这里放着一些轻松、有趣、打开就能玩的小游戏，
              不用安装，不挑设备，想放松几分钟时就来玩一会儿。
            </p>
            <div style={{ display: 'flex', gap: 36, justifyContent: 'center', paddingTop: 40, borderTop: '1px solid var(--border)' }}>
              {[
                { num: games.filter(g => g.status === 'live').length, lbl: '当前可玩' },
                { num: '随时', lbl: '浏览器即玩' },
                { num: 'FREE', lbl: '免费体验' },
              ].map(s => (
                <div key={s.lbl} style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(135deg,#fff,var(--purple2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>{s.num}</span>
                  <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{s.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section style={{ padding: '40px 0 100px' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px' }}>
            <div style={{ marginBottom: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--purple2)', marginBottom: 10 }}>// PLAY NOW</div>
              <h2 style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 800, letterSpacing: '-0.03em' }}>现在可以玩的游戏</h2>
            </div>

            {games.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text3)' }}>暂时还没有游戏，上线后会显示在这里。</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
                {games.map(game => <GameCard key={game.id} game={game} />)}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '28px 0', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text2)' }}>Flame<span style={{ color: 'var(--purple2)' }}>Games</span></span>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>games.viper3.top · 个人休闲游戏合集</span>
        </div>
      </footer>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const { sql } = await import('../lib/db');
    const games = await sql`SELECT * FROM games ORDER BY sort_order ASC, id ASC`;
    return { props: { initialGames: JSON.parse(JSON.stringify(games)) } };
  } catch {
    return { props: { initialGames: [] } };
  }
}
