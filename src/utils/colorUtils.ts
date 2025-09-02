export const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const generateColorVariations = (baseColor: string) => {
  const [h, s, l] = hexToHsl(baseColor);

  return {
    50: hslToHex(h, Math.max(s - 20, 10), Math.min(l + 40, 95)),
    100: hslToHex(h, Math.max(s - 15, 15), Math.min(l + 30, 90)),
    200: hslToHex(h, Math.max(s - 10, 20), Math.min(l + 20, 85)),
    300: hslToHex(h, Math.max(s - 5, 25), Math.min(l + 10, 80)),
    400: hslToHex(h, s, Math.min(l + 5, 75)),
    500: baseColor, // Original color
    600: hslToHex(h, Math.min(s + 5, 100), Math.max(l - 10, 25)),
    700: hslToHex(h, Math.min(s + 10, 100), Math.max(l - 20, 20)),
    800: hslToHex(h, Math.min(s + 15, 100), Math.max(l - 30, 15)),
    900: hslToHex(h, Math.min(s + 20, 100), Math.max(l - 40, 10)),
    950: hslToHex(h, Math.min(s + 25, 100), Math.max(l - 50, 5)),
  };
};
