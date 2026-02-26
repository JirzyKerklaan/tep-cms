import navigationData from '../navigation';
import { NavLink } from "../../core/interfaces/NavLink";
import { NavigationGroup } from "../../core/interfaces/NavGroup";

export function renderNav(name: string): string {
  const nav: NavigationGroup | undefined = navigationData[name];
  if (!nav || !Array.isArray(nav.links)) return '';

  const items = nav.links.map((link: NavLink) =>
      `<li><a href="${link.url}">${link.label}</a></li>`
  ).join('');

  return `<ul>${items}</ul>`;
}