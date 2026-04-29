import { sql } from '../../../lib/db';

function checkAuth(req) {
  return req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const games = await sql`SELECT * FROM games ORDER BY sort_order ASC, id ASC`;
      return res.status(200).json(games);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (!checkAuth(req)) {
    return res.status(401).json({ error: '密码错误' });
  }

  if (req.method === 'POST') {
    const { slug, name, description, url, tags, status, icon_url, cover_url } = req.body;
    if (!name) return res.status(400).json({ error: '名称不能为空' });
    if (!slug) return res.status(400).json({ error: 'slug 不能为空' });
    try {
      const result = await sql`
        INSERT INTO games (slug, name, description, url, tags, status, icon_url, cover_url, sort_order)
        VALUES (
          ${slug},
          ${name},
          ${description || ''},
          ${url || ''},
          ${tags || []},
          ${status || 'live'},
          ${icon_url || ''},
          ${cover_url || ''},
          (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM games)
        )
        RETURNING *
      `;
      return res.status(201).json(result[0]);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
