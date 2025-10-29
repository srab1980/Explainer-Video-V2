"use client";

import useProjectStore from "@/store/useProjectStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SceneCard from "./SceneCard";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const SceneTimeline = () => {
    const { scenes, reorderScenes } = useProjectStore((state) => state.currentProject)
        ? { scenes: state.currentProject.scenes, reorderScenes: useProjectStore.getState().reorderScenes }
        : { scenes: [], reorderScenes: () => {} };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = scenes.findIndex((scene) => scene.id === active.id);
            const newIndex = scenes.findIndex((scene) => scene.id === over.id);
            reorderScenes(oldIndex, newIndex);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Storyboard</CardTitle>
            </CardHeader>
            <CardContent>
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={scenes.map(scene => scene.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                            {scenes.map((scene) => (
                                <SceneCard key={scene.id} scene={scene} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </CardContent>
        </Card>
    );
};

export default SceneTimeline;
