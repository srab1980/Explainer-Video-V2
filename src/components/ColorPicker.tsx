"use client";

import { useState } from 'react';

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

const presetColors = [
    '#6b21a8', '#16a34a', '#db2777', '#f59e0b', '#dc2626', '#2563eb', '#0d9488', '#ec4899', '#f97316', '#71717a', '#000000', '#facc15'
];

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
    const [customColor, setCustomColor] = useState(value);

    const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomColor(e.target.value);
        onChange(e.target.value);
    };

    return (
        <div>
            <div className="grid grid-cols-6 gap-2">
                {presetColors.map((color) => (
                    <div
                        key={color}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${value === color ? 'border-primary' : 'border-transparent'}`}
                        onClick={() => onChange(color)}
                    />
                ))}
            </div>
            <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="mt-4 w-full"
            />
        </div>
    );
};

export default ColorPicker;
