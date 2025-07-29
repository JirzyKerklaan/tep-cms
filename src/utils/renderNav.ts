import navigationData from '../navigation';

interface NavLink {
  label: string;
  url: string;
}

export function renderNav(name: string): string {
  const nav = navigationData[name];
  if (!nav || !Array.isArray(nav.links)) return '';

  const items = nav.links.map((link: NavLink) =>
    `<li><a href="${link.url}">${link.label}</a></li>`
  ).join('');

  return `<ul>${items}</ul>`;
}
