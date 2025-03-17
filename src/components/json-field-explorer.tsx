// components/JsonFieldExplorer.tsx

import React from 'react';
import { useDrag } from 'react-dnd';
import { JsonValue } from '@/types/editor.types';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, File, Database } from "lucide-react";

interface JsonFieldExplorerProps {
  jsonData: any;
  onFieldSelect?: (path: string, value: JsonValue) => void;
}

const JsonFieldExplorer: React.FC<JsonFieldExplorerProps> = ({ jsonData }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [expandedPaths, setExpandedPaths] = React.useState<Set<string>>(new Set());

  const togglePath = (path: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedPaths(newExpanded);
  };

  const renderJsonNode = (value: JsonValue, path: string = '', level: number = 0) => {
    // Filter by search term if specified
    if (searchTerm && !path.toLowerCase().includes(searchTerm.toLowerCase())) {
      return null;
    }

    const isObject = value !== null && typeof value === 'object';
    const isExpanded = expandedPaths.has(path);

    if (!isObject) {
      return (
        <JsonLeafField 
          key={path} 
          path={path} 
          value={value as string | number | boolean | null} 
          level={level} 
        />
      );
    }

    const isArray = Array.isArray(value);
    
    return (
      <div key={path} className="ml-4">
        <div 
          className="flex items-center cursor-pointer hover:bg-gray-100 py-1"
          onClick={() => togglePath(path)}
        >
          <span className="mr-1">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
          <span className="mr-2">
            {isArray ? <Database size={16} /> : <File size={16} />}
          </span>
          <span className="font-medium">
            {path.split('.').pop() || 'root'} {isArray ? `[${Object.keys(value).length}]` : ''}
          </span>
        </div>
        
        {isExpanded && (
          <div className="pl-4">
            {Object.entries(value).map(([key, val]) => {
              const newPath = path ? `${path}.${key}` : key;
              return renderJsonNode(val, newPath, level + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-80 max-h-screen overflow-auto">
      <CardContent className="p-4">
        <Label htmlFor="search-fields">Buscar campos</Label>
        <Input
          id="search-fields"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="text-sm">
          {renderJsonNode(jsonData)}
        </div>
      </CardContent>
    </Card>
  );
};

interface JsonLeafFieldProps {
  path: string;
  value: string | number | boolean | null;
  level: number;
}

const JsonLeafField: React.FC<JsonLeafFieldProps> = ({ path, value, level }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'JSON_FIELD',
    item: { fieldPath: path, fieldValue: value },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  let displayValue: string;
  if (value === null) {
    displayValue = 'null';
  } else if (typeof value === 'boolean') {
    displayValue = value ? 'true' : 'false';
  } else {
    displayValue = String(value);
  }

  // Truncate long values
  if (displayValue.length > 15) {
    displayValue = displayValue.substring(0, 15) + '...';
  }

  return (
    <div 
      ref={drag as unknown as React.Ref<HTMLDivElement>} //! Check this line later
      style={{ marginLeft: `${level * 8}px`, opacity: isDragging ? 0.5 : 1 }}
      className="flex items-center cursor-move hover:bg-gray-100 py-1 px-2 rounded"
    >
      <span className="mr-2 text-gray-500">{path.split('.').pop()}:</span>
      <span className="text-blue-600">{displayValue}</span>
    </div>
  );
};

export default JsonFieldExplorer;