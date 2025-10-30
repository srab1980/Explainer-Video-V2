"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useProjectStore from "@/store/useProjectStore";
import { Scene, LayoutConfig, AnimationType } from "@/types";
import AssetStore from "./AssetStore";
import ColorPicker from "./ColorPicker";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface SceneEditorProps {
    scene: Scene;
    children: React.ReactNode;
}

const SceneEditor = ({ scene, children }: SceneEditorProps) => {
    const { isEditorOpen, openEditor, closeEditor, updateScene, autoGenerateIllustrations } = useProjectStore();
    const [isAssetStoreOpen, setAssetStoreOpen] = useState(false);
    const [editingIllustrationId, setEditingIllustrationId] = useState<string | null>(null);

    const handleIllustrationSelect = (library: 'lucide' | 'heroicons', iconName: string) => {
        if (editingIllustrationId) {
            const updatedIllustrations = scene.illustrations.map(ill =>
                ill.id === editingIllustrationId ? { ...ill, library, iconName } : ill
            );
            updateScene(scene.id, { illustrations: updatedIllustrations });
        } else {
            const newIllustration = {
                id: uuidv4(),
                library,
                iconName,
                keyword: '',
                color: '#000000',
                size: 'medium',
                position: { x: 50, y: 50 },
                rotation: 0,
                aspectRatio: 1,
            };
            updateScene(scene.id, { illustrations: [...scene.illustrations, newIllustration] });
        }
        setAssetStoreOpen(false);
    };

    return (
        <>
            <Dialog open={isEditorOpen} onOpenChange={(isOpen) => isOpen ? openEditor() : closeEditor()}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Edit Scene {scene.order + 1}</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="content">
                        <TabsList>
                            <TabsTrigger value="content">Content</TabsTrigger>
                            <TabsTrigger value="layout">Layout</TabsTrigger>
                            <TabsTrigger value="animation">Animation</TabsTrigger>
                            <TabsTrigger value="illustration">Illustration</TabsTrigger>
                        </TabsList>
                        <TabsContent value="content">
                            <div className="space-y-4">
                                <Textarea value={scene.text} onChange={(e) => updateScene(scene.id, { text: e.target.value })} />
                                <Input type="number" value={scene.duration} onChange={(e) => updateScene(scene.id, { duration: parseInt(e.target.value) })} />
                            </div>
                        </TabsContent>
                        <TabsContent value="layout">
                            <div className="space-y-4">
                                <Select
                                    onValueChange={(value: LayoutConfig['style']) => updateScene(scene.id, { layout: { ...scene.layout, style: value } })}
                                    defaultValue={scene.layout?.style || 'horizontal-row'}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="horizontal-row">Horizontal Row</SelectItem>
                                        <SelectItem value="vertical-stack">Vertical Stack</SelectItem>
                                        <SelectItem value="grid-2x2">Grid 2x2</SelectItem>
                                        <SelectItem value="grid-3x3">Grid 3x3</SelectItem>
                                        <SelectItem value="centered-large">Centered Large</SelectItem>
                                        <SelectItem value="side-by-side">Side by Side</SelectItem>
                                        <SelectItem value="scattered">Scattered</SelectItem>
                                        <SelectItem value="editorial">Editorial</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>
                        <TabsContent value="animation">
                            <Select onValueChange={(value: AnimationType) => updateScene(scene.id, { animation: value })} defaultValue={scene.animation}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fade">Fade</SelectItem>
                                    <SelectItem value="slide">Slide</SelectItem>
                                    <SelectItem value="zoom">Zoom</SelectItem>
                                    <SelectItem value="bounce">Bounce</SelectItem>
                                </SelectContent>
                            </Select>
                        </TabsContent>
                        <TabsContent value="illustration">
                            <div className="flex gap-2">
                                <Button onClick={() => { setEditingIllustrationId(null); setAssetStoreOpen(true); }}>Add Illustration</Button>
                                <Button onClick={() => autoGenerateIllustrations(scene.id)}>Auto Generate</Button>
                            </div>
                            <div className="space-y-4 mt-4">
                                {scene.illustrations.map((ill) => (
                                    <div key={ill.id} className="flex items-center gap-4">
                                        <Button onClick={() => { setEditingIllustrationId(ill.id); setAssetStoreOpen(true); }}>Change Icon</Button>
                                        <ColorPicker value={ill.color} onChange={(color) => updateScene(scene.id, { illustrations: scene.illustrations.map(i => i.id === ill.id ? { ...i, color } : i) })} />
                                        <Button variant="destructive" onClick={() => updateScene(scene.id, { illustrations: scene.illustrations.filter(i => i.id !== ill.id) })}>Remove</Button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
            <AssetStore isOpen={isAssetStoreOpen} onClose={() => setAssetStoreOpen(false)} onSelect={handleIllustrationSelect} />
        </>
    );
};

export default SceneEditor;
