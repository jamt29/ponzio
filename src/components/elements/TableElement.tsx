// components/elements/TableElement.tsx

import React, { useEffect, useState } from 'react';
import { TableElement } from '@/types/editor.types';
import { X, Move } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "../ui/table";

interface TableElementProps {
  element: TableElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TableElement>) => void;
  onDelete: () => void;
}

const TableElementComponent: React.FC<TableElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [position, setPosition] = useState({ x: element.x, y: element.y });
  const [size, setSize] = useState({
    width: element.width || 400,
    height: element.height || 200,
  });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Handle position updates
  useEffect(() => {
    if (element.x !== position.x || element.y !== position.y) {
      setPosition({ x: element.x, y: element.y });
    }
  }, [element.x, element.y]);

  // Handle size updates
  useEffect(() => {
    if (
      (element.width && element.width !== size.width) ||
      (element.height && element.height !== size.height)
    ) {
      setSize({
        width: element.width || size.width,
        height: element.height || size.height,
      });
    }
  }, [element.width, element.height]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isSelected) {
      onSelect();
      return;
    }
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.stopPropagation();
  };

  // Handle resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  // Mouse move handler for both dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const newWidth = Math.max(100, resizeStart.width + (e.clientX - resizeStart.x));
        const newHeight = Math.max(50, resizeStart.height + (e.clientY - resizeStart.y));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onUpdate({ x: position.x, y: position.y });
      } else if (isResizing) {
        setIsResizing(false);
        onUpdate({ width: size.width, height: size.height });
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, resizeStart, onUpdate]);

  // Get table data - limit rows for preview
  const tableData = element.data.slice(0, 5);
  const hasMoreRows = element.data.length > 5;

  return (
    <div
      className={`absolute ${isSelected ? 'outline-2 outline-blue-500' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        overflow: 'hidden',
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div 
        className="cursor-move bg-gray-100 p-1 flex items-center justify-between"
        onMouseDown={handleMouseDown}
      >
        <span className="text-xs font-medium flex items-center">
          <Move size={14} className="mr-1" />
          {element.fieldPath}
        </span>
        
        {isSelected && (
          <button
            className="text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div 
        style={{
          maxHeight: size.height - 30,
          overflow: 'auto',
          ...element.style,
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {element.columns.map((col, index) => (
                <TableHead 
                  key={index}
                  style={{
                    width: col.width,
                    ...col.style,
                  }}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {element.columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {typeof row[col.field] !== 'object' 
                      ? String(row[col.field] !== undefined ? row[col.field] : '') 
                      : JSON.stringify(row[col.field])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {hasMoreRows && (
              <TableRow>
                <TableCell 
                  colSpan={element.columns.length}
                  className="text-center text-gray-500 italic"
                >
                  {element.data.length - 5} más filas...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Resize handle */}
      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};

export default TableElementComponent;