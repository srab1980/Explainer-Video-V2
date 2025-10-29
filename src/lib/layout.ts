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
            return illustrations.map((illustration, index) => ({
                ...illustration,
                position: {
                    x: index % 2 === 0 ? 25 : 75,
                    y: index < 2 ? 25 : 75,
                },
            }));
        default:
            return illustrations.map((illustration, index) => ({
                ...illustration,
                position: {
                    x: 50,
                    y: 50,
                },
            }));
    }
};
