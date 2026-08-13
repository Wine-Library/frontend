import classNames from "classnames";
import type { NavLinkItem } from "@/types";

export const navLinks: NavLinkItem[] = [
  { to: '/', title: 'home' },
  { to: '/Wines', title: 'Wines' },
];

export const getLinkClass = (s: Record<string, string>) =>
  ({ isActive }: { isActive: boolean }) =>
    classNames(s.navLink, isActive && s.navLinkSelected);

export const getLink = (s: Record<string, string>) =>
  ({ isActive }: { isActive: boolean }) =>
    classNames( s.navVector,isActive && s.navVectorSelected);