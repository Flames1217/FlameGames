-- 在 Neon 控制台 SQL Editor 里执行这段代码来初始化数据库

CREATE TABLE IF NOT EXISTS games (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  description TEXT         NOT NULL DEFAULT '',
  url         VARCHAR(500) NOT NULL DEFAULT '',
  tags        TEXT[]       NOT NULL DEFAULT '{}',
  status      VARCHAR(20)  NOT NULL DEFAULT 'live',
  color       VARCHAR(20)  NOT NULL DEFAULT 'purple',
  sort_order  INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

INSERT INTO games (slug, name, description, url, tags, status, color, sort_order) VALUES
(
  'drysland',
  'Drysland',
  'Three.js 驱动的 3D 沙漠地形探索，程序化生成无限地貌，沉浸式氛围体验。',
  'https://drysland.vercel.app',
  ARRAY['WebGL','3D','探索'],
  'live',
  'purple',
  1
),
(
  'wolfcha',
  'Wolfcha',
  '与 AI 对手展开智力博弈，融合对话与策略，测试你的心理与判断力。',
  'https://wolfcha.vercel.app',
  ARRAY['AI','Next.js','策略'],
  'live',
  'cyan',
  2
);
