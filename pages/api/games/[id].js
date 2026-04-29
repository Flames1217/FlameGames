import { sql } from '../../../lib/db';

function checkAuth(req) {
  return req.headers['x-admin-password'] === process.env.ADMIN_PASSWORD;
}

export default async function handler(req, res) {
  if (!checkAuth(req)) {
    return res.status(401).json({ error: '密码错误' });
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const { name, description, url, tags, status, color, sort_order } = req.body;
    try {
      const result = await sql`
        UPDATE games SET
          name        = COALESCE(${name}, name),
          description = COALESCE(${description}, description),
          url         = COALESCE(${url}, url),
          tags        = COALESCE(${tags}, tags),
          status      = COALESCE(${status}, status),
          color       = COALESCE(${color}, color),
          sort_order  = COALESCE(${sort_order}, sort_order)
        WHERE id = ${id}
        RETURNING *
      `;
      if (result.length === 0) return res.status(404).json({ error: '游戏不存在' });
      return res.status(200).json(result[0]);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM games WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
