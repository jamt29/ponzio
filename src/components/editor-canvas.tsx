// components/EditorCanvas.tsx

import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { EditorElement } from '@/types/editor.types';
import TextElementComponent from './elements/TextElement';
import TableElementComponent from './elements/TableElement';
import { toast} from 'sonner';

interface EditorCanvasProps {
  elements: EditorElement[];
  onElementsChange: (elements: EditorElement[]) => void;
  onElementSelect: (element: EditorElement | null) => void;
  selectedElementId: string | null;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  elements,
  onElementsChange,
  onElementSelect,
  selectedElementId,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Handle drag and drop of JSON fields onto the canvas
  const [{ isOver }, drop] = useDrop({
    accept: 'JSON_FIELD',
    drop: (item: { fieldPath: string; fieldValue: any }, monitor) => {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const x = (clientOffset.x - canvasRect.left) / scale;
      const y = (clientOffset.y - canvasRect.top) / scale;

      addElement(item, { x, y });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Add a new element to the canvas
  const addElement = (
    item: { fieldPath: string; fieldValue: any },
    position: { x: number; y: number }
  ) => {
    const { fieldPath, fieldValue } = item;
    
    let newElement: EditorElement;
    
    // If it's an array, create a table element
    if (Array.isArray(fieldValue)) {
      // Create columns from first item if available
      const columns = fieldValue.length > 0 && typeof fieldValue[0] === 'object'
        ? Object.keys(fieldValue[0]).map(key => ({
            field: key,
            header: key,
            width: 100,
          }))
        : [{ field: '0', header: 'Value', width: 200 }];
      
      newElement = {
        id: `element-${Date.now()}`,
        type: 'table',
        fieldPath,
        data: fieldValue,
        columns,
        x: position.x,
        y: position.y,
        width: 400,
        height: 200,
        style: {
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
        },
      };
      
      toast('Tabla creada');
    } else {
      // Create a text element for scalar values
      newElement = {
        id: `element-${Date.now()}`,
        type: 'text',
        fieldPath,
        content: String(fieldValue),
        x: position.x,
        y: position.y,
        style: {
          color: '#000000',
          fontSize: '16px',
          fontFamily: 'Arial',
        },
      };
    }
    
    const updatedElements = [...elements, newElement];
    onElementsChange(updatedElements);
    onElementSelect(newElement);
  };

  // Update an element's properties
  const updateElement = (id: string, updates: Partial<EditorElement>) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, ...updates as any } : el
    ) as EditorElement[];
    onElementsChange(updatedElements);
  };

  // Handle selection of elements
  const handleElementSelect = (element: EditorElement) => {
    onElementSelect(element);
  };

  // Handlers for common operations
  const handleDeleteElement = (id: string) => {
    const updatedElements = elements.filter((el) => el.id !== id);
    onElementsChange(updatedElements);
    onElementSelect(null);
  };

  return (
    <div className="relative flex-grow overflow-hidden border border-gray-300 bg-gray-100">
      <div className="sticky top-0 z-10 bg-white p-2 border-b flex items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="p-1 rounded hover:bg-gray-200"
          >
            -
          </button>
          <span>{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(Math.min(2, scale + 0.1))}
            className="p-1 rounded hover:bg-gray-200"
          >
            +
          </button>
        </div>
      </div>

      <div
        ref={(node) => {
          drop(node);
          if (node) canvasRef.current = node;
        }}
        className={`relative w-full min-h-[1123px] bg-white mx-auto shadow-lg ${
          isOver ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          width: '794px', // A4 width in pixels at 96 DPI
          height: '1123px', // A4 height in pixels at 96 DPI
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          marginBottom: `${(scale - 1) * 1123}px`,
          marginRight: `${(scale - 1) * 794}px`,
        }}
      >
        {elements.map((element) => {
          const isSelected = element.id === selectedElementId;
          
          switch (element.type) {
            case 'text':
              return (
                <TextElementComponent
                  key={element.id}
                  element={element}
                  isSelected={isSelected}
                  onSelect={() => handleElementSelect(element)}
                  onUpdate={(updates) => updateElement(element.id, updates)}
                  onDelete={() => handleDeleteElement(element.id)}
                />
              );
            case 'table':
              return (
                <TableElementComponent
                  key={element.id}
                  element={element}
                  isSelected={isSelected}
                  onSelect={() => handleElementSelect(element)}
                  onUpdate={(updates) => updateElement(element.id, updates)}
                  onDelete={() => handleDeleteElement(element.id)}
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default EditorCanvas;