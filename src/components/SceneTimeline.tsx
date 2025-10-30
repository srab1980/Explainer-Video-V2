"use client";

import useProjectStore from "@/store/useProjectStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SceneCard from "./SceneCard";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "./ui/button";

const SceneTimeline = () => {
    const { currentProject, reorderScenes, addScene, setActiveScene, activeSceneId } = useProjectStore();
    const scenes = currentProject?.scenes ?? [];

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
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
                                <SceneCard
                                    key={scene.id}
                                    scene={scene}
                                    isActive={scene.id === activeSceneId}
                                    onSelect={() => setActiveScene(scene.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                <Button className="mt-4 w-full" variant="secondary" onClick={addScene}>Add Scene</Button>
            </CardContent>
        </Card>
    );
};

export default SceneTimeline;
