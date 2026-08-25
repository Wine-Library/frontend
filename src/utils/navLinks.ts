import classNames from "classnames";
import type { NavLinkItem } from "@/types";

export const navLinks: NavLinkItem[] = [
  { to: '/', title: 'Home' },
  { to: '/Wines', title: 'Wines' },
];

export const getLinkClass = (s: Record<string, string>) =>
  ({ isActive }: { isActive: boolean }) =>
    classNames(s.navLink, isActive && s.navLinkSelected);

export const getLink = (s: Record<string, string>) =>
  ({ isActive }: { isActive: boolean }) =>
    classNames(s.navVector, isActive && s.navVectorSelected);

export const getProfile = (s: Record<string, string>) =>
  ({ isActive }: { isActive: boolean }) =>
    classNames(s.profileNavItem, isActive && s.profileNavItemActive);

export const getPage = (s: Record<string, string>) =>
  ({ isActive }: { isActive: boolean }) =>
    classNames( s.winesPagesButton, isActive && s.winesPagesButtonSelected);