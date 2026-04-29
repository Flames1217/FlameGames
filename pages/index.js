import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

const COLOR_MAP = {
  purple: { border: 'rgba(139,92,246,0.4)', glow: 'rgba(139,92,246,0.15)', tag: { bg: 'rgba(139,92,246,0.12)', color: '#A78BFA', border: 'rgba(139,92,246,0.2)' }, btn: { bg: '#8B5CF6', color: '#fff' }, thumb: 'linear-gradient(135deg,#1a1030,#0d0820)' },
  cyan:   { border: 'rgba(34,211,238,0.4)',  glow: 'rgba(34,211,238,0.12)',  tag: { bg: 'rgba(34,211,238,0.1)',  color: '#22D3EE', border: 'rgba(34,211,238,0.2)' }, btn: { bg: 'rgba(34,211,238,0.15)', color: '#22D3EE' }, thumb: 'linear-gradient(135deg,#061825,#0a1a2e)' },
  pink:   { border: 'rgba(236,72,153,0.35)', glow: 'rgba(236,72,153,0.1)',  tag: { bg: 'rgba(236,72,153,0.1)',  color: '#EC4899', border: 'rgba(236,72,153,0.2)' }, btn: { bg: '#EC4899', color: '#fff' }, thumb: 'linear-gradient(135deg,#1a0818,#0e0515)' },
  green:  { border: 'rgba(16,185,129,0.35)', glow: 'rgba(16,185,129,0.1)',  tag: { bg: 'rgba(16,185,129,0.1)',  color: '#10B981', border: 'rgba(16,185,129,0.2)' }, btn: { bg: '#10B981', color: '#fff' }, thumb: 'linear-gradient(135deg,#051a10,#081510)' },
};

function GameCard({ game }) {
  const c = COLOR_MAP[game.color] || COLOR_MAP.purple;
  const isLive = game.status === 'live';
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0A0A14';
      ctx.fillRect(0, 0, W, H);

      if (game.color === 'purple') {
        // Terrain waves
        const layers = [
          { amp: 18, freq: 0.013, speed: 0.3, y: 0.60, color: 'rgba(60,30,100,0.8)' },
          { amp: 14, freq: 0.019, speed: 0.5, y: 0.72, color: 'rgba(90,45,150,0.7)' },
          { amp: 10, freq: 0.028, speed: 0.9, y: 0.82, color: 'rgba(120,60,200,0.55)' },
        ];
        layers.forEach(l => {
          ctx.beginPath();
          ctx.moveTo(0, H);
          for (let x = 0; x <= W; x += 2) {
            const y = l.y * H + Math.sin(x * l.freq + t * l.speed) * l.amp + Math.sin(x * l.freq * 2 + t * l.speed * 1.4) * l.amp * 0.4;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(W, H); ctx.closePath();
          ctx.fillStyle = l.color; ctx.fill();
        });
        // Glow line
        const last = layers[2];
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
          const y = last.y * H + Math.sin(x * last.freq + t * last.speed) * last.amp + Math.sin(x * last.freq * 2 + t * last.speed * 1.4) * last.amp * 0.4;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(167,139,250,0.6)'; ctx.lineWidth = 1.5; ctx.stroke();

      } else if (game.color === 'cyan') {
        // Grid + scan
        const sq = 28;
        ctx.strokeStyle = 'rgba(34,211,238,0.06)'; ctx.lineWidth = 0.5;
        for (let x = 0; x < W; x += sq) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y < H; y += sq) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
        const scanY = (t * 40) % H;
        const sg = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
        sg.addColorStop(0, 'transparent'); sg.addColorStop(0.5, 'rgba(34,211,238,0.25)'); sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg; ctx.fillRect(0, scanY - 20, W, 40);
        for (let i = 0; i < 12; i++) {
          const px = (i * W / 11); const py = H / 2 + Math.sin(t * 1.5 + i * 0.6) * 30;
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34,211,238,${0.3 + 0.3 * Math.sin(t + i)})`; ctx.fill();
        }

      } else if (game.color === 'pink') {
        // Particle burst
        for (let i = 0; i < 20; i++) {
          const angle = (i / 20) * Math.PI * 2 + t * 0.3;
          const r = 30 + Math.sin(t * 2 + i) * 10;
          const px = W / 2 + Math.cos(angle) * r; const py = H / 2 + Math.sin(angle) * r;
          ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(236,72,153,${0.3 + 0.4 * Math.sin(t * 1.5 + i)})`; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(W / 2, H / 2, 8 + Math.sin(t * 2) * 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236,72,153,0.5)'; ctx.fill();

      } else {
        // Green: flowing lines
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          for (let x = 0; x <= W; x += 4) {
            const y = H * (0.3 + i * 0.12) + Math.sin(x * 0.02 + t * 0.8 + i) * 14;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = `rgba(16,185,129,${0.08 + i * 0.04})`; ctx.lineWidth = 1; ctx.stroke();
        }
      }

      t += 0.016;
      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); };
  }, [game.color]);

  return (
    <a
      href={isLive ? `/games/${game.slug}` : undefined}
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
        e.currentTarget.style.borderColor = c.border;
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
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
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
              background: c.tag.bg, color: c.tag.color, border: `1px solid ${c.tag.border}`
            }}>{tag}</span>
          ))}
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em' }}>{game.name}</div>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, flex: 1 }}>{game.description}</p>
        <div style={{ marginTop: 6 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: '8px 18px',
            borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
            ...(isLive ? c.btn : { background: 'rgba(255,255,255,0.06)', color: 'var(--text3)' }),
            border: game.color === 'cyan' ? `1px solid rgba(34,211,238,0.3)` : 'none',
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
