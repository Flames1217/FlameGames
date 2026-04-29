-- 在 Neon 控制台的 SQL Editor 中执行本文件以初始化数据库
-- 注意：url 字段建议填站内路径（如 /wolfcha/），由站点 rewrite 负责映射到目标应用

CREATE TABLE IF NOT EXISTS games (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  description TEXT         NOT NULL DEFAULT '',
  url         VARCHAR(500) NOT NULL DEFAULT '',
  icon_url    VARCHAR(500) NOT NULL DEFAULT '',
  cover_url   VARCHAR(500) NOT NULL DEFAULT '',
  tags        TEXT[]       NOT NULL DEFAULT '{}',
  status      VARCHAR(20)  NOT NULL DEFAULT 'live',
  sort_order  INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE games ADD COLUMN IF NOT EXISTS icon_url VARCHAR(500) NOT NULL DEFAULT '';
ALTER TABLE games ADD COLUMN IF NOT EXISTS cover_url VARCHAR(500) NOT NULL DEFAULT '';

INSERT INTO games (slug, name, description, url, icon_url, cover_url, tags, status, sort_order) VALUES
(
  'drysland',
  'Drysland',
  'Three.js 驱动的 3D 沙漠探索体验，支持程序化地形与沉浸式场景。',
  '/drysland/',
  '',
  '',
  ARRAY['WebGL', '3D', '探索'],
  'live',
  1
),
(
  'wolfcha',
  'Wolfcha',
  '与 AI 对手进行策略对弈，融合聊天互动与决策博弈。',
  '/wolfcha/',
  '',
  '',
  ARRAY['AI', 'Next.js', '策略'],
  'live',
  2
);
