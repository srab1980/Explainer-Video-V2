"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scene } from "@/types";
import SceneEditor from "./SceneEditor";
import useProjectStore from "@/store/useProjectStore";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SceneCardProps {
    scene: Scene;
}

const SceneCard = ({ scene }: SceneCardProps) => {
    const { setActiveScene, deleteScene, activeSceneId } = useProjectStore();
    const isActive = scene.id === activeSceneId;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: scene.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className={cn({ "border-l-4 border-accent bg-muted": isActive })}>
                <CardContent className="p-4 flex justify-between items-center">
                    <p className="text-sm cursor-pointer" onClick={() => setActiveScene(scene.id)}>{scene.text}</p>
                    <div className="flex gap-2">
                        <SceneEditor scene={scene}>
                            <Button variant="outline" size="sm">Edit</Button>
                        </SceneEditor>
                        <Button variant="destructive" size="sm" onClick={() => deleteScene(scene.id)}>Delete</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SceneCard;
