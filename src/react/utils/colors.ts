
const generateColors = () => {
    const mainstreamColors: string[] = [];

    for (let i = 0; i < 500; i++) {
    const hue = (i * 137.508) % 360; // Golden angle to create diverse colors
    const color = `hsl(${hue}, 70%, 60%)`;
    mainstreamColors.push(color);
    }

    return mainstreamColors;
}

export const buildColorMap = (labels: string[]) => {
    const colorMap: Record<string, string> = {};
    const colors = generateColors();
    for (const label of labels) {
        colorMap[label] = colors.pop();
    }
    return colorMap;
}
