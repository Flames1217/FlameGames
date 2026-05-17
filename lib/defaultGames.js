export const DEFAULT_GAMES = [
  {
    id: -1,
    slug: 'drysland',
    name: 'Drysland',
    description: 'Three.js 驱动的 3D 沙漠探索体验，支持程序化地形与沉浸式场景。',
    url: 'https://drysland-nu.vercel.app/',
    icon_url: '',
    cover_url: '',
    tags: ['WebGL', '3D', '探索'],
    status: 'live',
    sort_order: 1,
    builtin: true,
  },
  {
    id: -2,
    slug: 'wolfcha',
    name: 'Wolfcha',
    description: '与 AI 对手进行策略对弈，融合聊天互动与决策博弈。',
    url: 'https://wolfcha-iota.vercel.app/',
    icon_url: '',
    cover_url: '',
    tags: ['AI', 'Next.js', '策略'],
    status: 'live',
    sort_order: 2,
    builtin: true,
  },
  {
    id: -3,
    slug: 'noname',
    name: '无名杀',
    description: '浏览器里的三国策略卡牌对战游戏，打开即可游玩。',
    url: 'https://noname.viper3.top/',
    icon_url: '',
    cover_url: '',
    tags: ['卡牌', '策略', '三国'],
    status: 'live',
    sort_order: 3,
    builtin: true,
  },
  {
    id: -4,
    slug: 'poke-auto-chess',
    name: '宝可梦自走棋',
    description: '以宝可梦为主题的浏览器自走棋对战体验。',
    url: 'https://pokev9.52kx.net/',
    icon_url: '',
    cover_url: '',
    tags: ['自走棋', '宝可梦', '策略'],
    status: 'live',
    sort_order: 4,
    builtin: true,
  },
];

export function sortGames(games) {
  return [...games].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || (a.id ?? 0) - (b.id ?? 0));
}

export function mergeGames(dbGames = []) {
  const gamesBySlug = new Map(DEFAULT_GAMES.map(game => [game.slug, game]));

  for (const game of dbGames) {
    const defaultGame = gamesBySlug.get(game.slug);
    const mergedGame = {
      ...(defaultGame || {}),
      ...game,
      builtin: false,
    };

    if (defaultGame && game.url?.startsWith('/')) {
      mergedGame.url = defaultGame.url;
    }

    gamesBySlug.set(game.slug, {
      ...mergedGame,
    });
  }

  return sortGames([...gamesBySlug.values()]);
}

export function findGameBySlug(dbGames = [], slug) {
  return mergeGames(dbGames).find(game => game.slug === slug) || null;
}
