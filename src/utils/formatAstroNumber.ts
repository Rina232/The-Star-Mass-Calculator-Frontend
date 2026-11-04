const SUPERSCRIPT_DIGITS: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "-": "⁻",
};

const toSuperscript = (value: number): string =>
    String(value)
        .split("")
        .map((char) => SUPERSCRIPT_DIGITS[char] ?? char)
        .join("");

export const formatAstroNumber = (value: number | null): string => {
    const numericValue = Number(value);
    if (!numericValue) {
        return "0";
    }

    const integerDigitsCount = Math.floor(Math.abs(numericValue)).toString().length;

    if (integerDigitsCount <= 3) {
        return Number(numericValue.toFixed(2)).toString();
    }

    const exponent = Math.floor(Math.log10(Math.abs(numericValue)));
    const mantissa = Number((numericValue / 10 ** exponent).toFixed(1));

    return `${mantissa}×10${toSuperscript(exponent)}`;
};
