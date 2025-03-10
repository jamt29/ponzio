// components/elements/TextElement.tsx

import React, { useRef, useState, useEffect } from 'react';
import { TextElement } from '@/types/editor.types';
import { useDrag } from 'react-dnd';
import { X } from 'lucide-react';

interface TextElementProps {
  element: TextElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextElement>) => void;
  onDelete: () => void;
}

const TextElementComponent: React.FC<TextElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(element.content);
  const textRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: element.x, y: element.y });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Apply changes when editing is done
  useEffect(() => {
    if (!editing && content !== element.content) {
      onUpdate({ content });
    }
  }, [editing, content, element.content, onUpdate]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelected) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      e.stopPropagation();
    }
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdate({ x: position.x, y: position.y });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, onUpdate]);

  // Double click to edit
  const handleDoubleClick = () => {
    setEditing(true);
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.focus();
      }
    }, 0);
  };

  // Finish editing when clicking outside or pressing Enter
  const handleBlur = () => {
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      setEditing(false);
      e.preventDefault();
    }
  };

  return (
    <div
      className={`absolute cursor-move ${
        isSelected ? 'outline outline-2 outline-blue-500' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <div
          ref={textRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="min-w-[50px] min-h-[20px] outline-none"
          style={element.style}
          dangerouslySetInnerHTML={{ __html: content }}
          onInput={(e) => setContent(e.currentTarget.textContent || '')}
        />
      ) : (
        <div style={element.style}>{content}</div>
      )}

      {isSelected && (
        <button
          className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default TextElementComponent;