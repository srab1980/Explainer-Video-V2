"use client";

import { useEffect } from "react";
import ScriptInput from "@/components/ScriptInput";
import SceneTimeline from "@/components/SceneTimeline";
import PreviewCanvas from "@/components/PreviewCanvas";
import AutoSaveIndicator from "@/components/AutoSaveIndicator";
import useProjectStore from "@/store/useProjectStore";

export default function Home() {
  const { currentProject, createProject } = useProjectStore();

  useEffect(() => {
    // On mount, create a new project if one doesn't exist.
    if (!currentProject) {
      createProject("My First Storyboard");
    }
  }, [currentProject, createProject]);

  // Render a loading state until the project is created.
  if (!currentProject) {
    return <div>Loading project...</div>;
  }

  return (
    <main className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">StoryVid Storyboard Creator</h1>
        <AutoSaveIndicator />
      </header>
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div className="w-full md:w-1/4 p-4 overflow-y-auto">
          <ScriptInput />
        </div>
        <div className="w-full md:w-1/2 p-4 flex items-center justify-center">
          <PreviewCanvas />
        </div>
        <div className="w-full md:w-1/4 p-4 overflow-y-auto">
          <SceneTimeline />
        </div>
      </div>
    </main>
  );
}
