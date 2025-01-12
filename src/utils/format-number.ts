export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(num);
};
