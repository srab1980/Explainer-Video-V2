"use client";
import { Scene } from "@/types";
import { FC } from "react";
import { motion } from "framer-motion";
import { calculateIllustrationPositions } from "@/lib/layout";
import * as animations from "@/lib/animations";
import { icons } from 'lucide-react';

interface IllustrationCanvasProps {
    scene: Scene;
    animate: boolean;
}

const IllustrationCanvas: FC<IllustrationCanvasProps> = ({ scene, animate }) => {
    const positionedIllustrations = calculateIllustrationPositions(scene.layout, scene.illustrations, 1600, 900);

    return (
        <div className="relative w-full h-full">
            {positionedIllustrations.map((illustration, index) => {
                const LucideIcon = icons[illustration.iconName as keyof typeof icons];
                if (!LucideIcon) return null;

                const animationVariants = animations[scene.animation];

                return (
                    <motion.div
                        key={illustration.id}
                        initial={animate ? animationVariants.hidden : {}}
                        animate={animate ? animationVariants.visible : {}}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            position: 'absolute',
                            left: `${illustration.position.x}%`,
                            top: `${illustration.position.y}%`,
                            transform: `rotate(${illustration.rotation}deg)`,
                            color: illustration.color,
                        }}
                    >
                        <LucideIcon
                            width={illustration.size === 'small' ? 32 : illustration.size === 'medium' ? 64 : illustration.size === 'large' ? 96 : 128}
                            height={illustration.size === 'small' ? 32 : illustration.size === 'medium' ? 64 : illustration.size === 'large' ? 96 : 128}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
};

export default IllustrationCanvas;
