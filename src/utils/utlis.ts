export function getPasswordError(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter.';
  return null;
}

export const navLink = [
    { id: 'https://github.com/Wine-Library', title: 'Github' },
    { id: 'https://github.com/Wine-Library/frontend', title: 'Contacts' },
    { id: 'https://github.com/Wine-Library/backend', title: 'rights' },
  ];