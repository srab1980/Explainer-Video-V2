"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useProjectStore from "@/store/useProjectStore";

const ScriptInput = () => {
    // Get the whole project, then destructure the script.
    const { currentProject, updateScript, generateScenes } = useProjectStore();
    const script = currentProject?.script ?? "";

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
                    // The button should be disabled when the AI is generating scenes.
                    disabled={useProjectStore.getState().isGenerating}
                />
                <Button
                    className="mt-4"
                    onClick={() => generateScenes(script)}
                    disabled={useProjectStore.getState().isGenerating}
                >
                    {useProjectStore.getState().isGenerating ? "Generating..." : "Generate Storyboard"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default ScriptInput;
