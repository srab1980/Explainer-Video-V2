import { LayoutConfig, Illustration } from "@/types";

export const calculateIllustrationPositions = (
    layout: LayoutConfig,
    illustrations: Illustration[],
    canvasWidth: number,
    canvasHeight: number
): Illustration[] => {
    const illustrationCount = illustrations.length;
    if (illustrationCount === 0) return [];

    switch (layout.style) {
        case 'horizontal-row':
            return illustrations.map((illustration, index) => ({
                ...illustration,
                position: {
                    x: (100 / (illustrationCount + 1)) * (index + 1),
                    y: 50,
                },
            }));
        case 'vertical-stack':
            return illustrations.map((illustration, index) => ({
                ...illustration,
                position: {
                    x: 50,
                    y: (100 / (illustrationCount + 1)) * (index + 1),
                },
            }));
        case 'grid-2x2':
            return illustrations.slice(0, 4).map((illustration, index) => ({
                ...illustration,
                position: {
                    x: (index % 2) * 50 + 25,
                    y: Math.floor(index / 2) * 50 + 25,
                },
            }));
        case 'grid-3x3':
            return illustrations.slice(0, 9).map((illustration, index) => ({
                ...illustration,
                position: {
                    x: (index % 3) * 33.3 + 16.6,
                    y: Math.floor(index / 3) * 33.3 + 16.6,
                },
            }));
        case 'centered-large':
            return illustrations.slice(0, 1).map(illustration => ({
                ...illustration,
                position: { x: 50, y: 50 },
                size: 'extra-large',
            }));
        case 'side-by-side':
            return illustrations.slice(0, 2).map((illustration, index) => ({
                ...illustration,
                position: { x: index === 0 ? 25 : 75, y: 50 },
                size: 'large',
            }));
        case 'scattered':
            return illustrations.map(illustration => ({
                ...illustration,
                position: illustration.position,
            }));
        case 'editorial':
            if (illustrationCount === 0) return [];
            const editorialIllustrations = [...illustrations];
            const primary = {
                ...editorialIllustrations[0],
                position: { x: 30, y: 50 },
                size: 'extra-large',
            };
            const secondaries = editorialIllustrations.slice(1, 4).map((ill, index) => ({
                ...ill,
                position: { x: 75, y: (100 / (Math.min(editorialIllustrations.length - 1, 3) + 1)) * (index + 1) },
                size: 'medium',
            }));
            return [primary, ...secondaries];
        default:
            return illustrations.map(illustration => ({
                ...illustration,
                position: { x: 50, y: 50 },
            }));
    }
};
