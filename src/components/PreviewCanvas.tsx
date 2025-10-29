"use client";

import useProjectStore from "@/store/useProjectStore";
import { Card, CardContent } from "@/components/ui/card";
import IllustrationCanvas from "./IllustrationCanvas";

const PreviewCanvas = () => {
    const { activeSceneId, currentProject } = useProjectStore();

    const activeScene = currentProject?.scenes.find(scene => scene.id === activeSceneId);

    return (
        <Card className="w-full h-full aspect-video">
            <CardContent className="flex items-center justify-center h-full">
                {activeScene ? (
                    <IllustrationCanvas scene={activeScene} animate={true} />
                ) : (
                    <p>Select a scene to preview</p>
                )}
            </CardContent>
        </Card>
    );
};

export default PreviewCanvas;
