export const RULES = [
  { key: "length", label: "8+ characters", test: (pw: string) => pw.length >= 8 },
  { key: "uppercase", label: "At least 1 uppercase", test: (pw: string) => /[A-Z]/.test(pw) },
  { key: "lowercase", label: "At least 1 lowercase", test: (pw: string) => /[a-z]/.test(pw) },
  { key: "number", label: "At least 1 number", test: (pw: string) => /[0-9]/.test(pw) },
  { key: "special", label: "1 special character", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];