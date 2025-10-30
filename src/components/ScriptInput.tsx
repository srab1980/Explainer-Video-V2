"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useProjectStore from "@/store/useProjectStore";

const ScriptInput = () => {
    const { currentProject, updateScript, generateScenes, isGenerating } = useProjectStore();
    const script = currentProject?.script ?? "";
    const wordCount = script.trim().split(/\s+/).filter(Boolean).length;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Script</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Paste your explainer video script here..."
                    className="min-h-[400px]"
                    value={script}
                    onChange={(e) => updateScript(e.target.value)}
                    disabled={isGenerating}
                />
                <div className="flex justify-between items-center mt-4">
                    <p className={`text-sm ${wordCount > 500 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {wordCount} words
                    </p>
                    <Button
                        onClick={() => generateScenes(script)}
                        disabled={isGenerating || !script || script.trim().length < 10}
                    >
                        {isGenerating ? "Generating..." : "Generate Storyboard"}
                    </Button>
                </div>
                {wordCount > 500 && (
                    <p className="text-sm text-destructive mt-2">
                        ⚠️ Script is long. Consider splitting into multiple videos for best results.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default ScriptInput;
