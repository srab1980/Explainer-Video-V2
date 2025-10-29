"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { icons } from 'lucide-react';

interface AssetStoreProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (library: 'lucide' | 'heroicons', iconName: string) => void;
}

const AssetStore = ({ isOpen, onClose, onSelect }: AssetStoreProps) => {
    const lucideIcons = Object.keys(icons);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Choose Illustration</DialogTitle>
                </DialogHeader>
                <Input placeholder="Search icons..." />
                <Tabs defaultValue="lucide">
                    <TabsList>
                        <TabsTrigger value="lucide">Lucide</TabsTrigger>
                        <TabsTrigger value="heroicons">Heroicons</TabsTrigger>
                    </TabsList>
                    <TabsContent value="lucide" className="grid grid-cols-6 gap-4 max-h-[400px] overflow-y-auto">
                        {lucideIcons.map((iconName) => {
                            const LucideIcon = icons[iconName as keyof typeof icons];
                            return (
                                <div key={iconName} className="p-2 border rounded-md flex items-center justify-center cursor-pointer" onClick={() => onSelect('lucide', iconName)}>
                                    <LucideIcon />
                                </div>
                            );
                        })}
                    </TabsContent>
                    <TabsContent value="heroicons">
                        <p>Heroicons will be listed here.</p>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default AssetStore;
