"use client";

import useProjectStore from "@/store/useProjectStore";
import { Badge } from "@/components/ui/badge";

const AutoSaveIndicator = () => {
    const { autoSaveStatus } = useProjectStore();

    if (autoSaveStatus === 'idle') return null;

    return (
        <Badge variant={autoSaveStatus === 'error' ? 'destructive' : 'secondary'}>
            {autoSaveStatus === 'saving' && "Saving..."}
            {autoSaveStatus === 'saved' && "Saved"}
            {autoSaveStatus === 'error' && "Save failed"}
        </Badge>
    );
};

export default AutoSaveIndicator;
