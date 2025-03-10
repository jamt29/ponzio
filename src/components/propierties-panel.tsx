// components/PropertiesPanel.tsx

import React from 'react';
import { EditorElement, TextElement, TableElement } from '@/types/editor.types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic 
} from "lucide-react";

interface PropertiesPanelProps {
  selectedElement: EditorElement | null;
  onElementUpdate: (updates: Partial<EditorElement>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedElement,
  onElementUpdate,
}) => {
  if (!selectedElement) {
    return (
      <Card className="w-64">
        <CardHeader>
          <CardTitle>Propiedades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Selecciona un elemento para editar sus propiedades
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleStyleChange = (property: string, value: string) => {
    onElementUpdate({
      style: {
        ...selectedElement.style,
        [property]: value,
      },
    });
  };

  const handlePositionChange = (property: 'x' | 'y', value: number) => {
    onElementUpdate({ [property]: value });
  };

  const handleSizeChange = (property: 'width' | 'height', value: number) => {
    onElementUpdate({ [property]: value });
  };

  // For table elements - update column properties
  const handleColumnUpdate = (index: number, updates: any) => {
    if (selectedElement.type === 'table') {
      const newColumns = [...(selectedElement as TableElement).columns];
      newColumns[index] = { ...newColumns[index], ...updates };
      
      onElementUpdate({
        columns: newColumns,
      });
    }
  };

  return (
    <Card className="w-64 max-h-screen overflow-auto">
      <CardHeader className="py-3">
        <CardTitle className="text-sm">
          {selectedElement.type === 'text' ? 'Texto' : 
           selectedElement.type === 'table' ? 'Tabla' : 'Elemento'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <Tabs defaultValue="style">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="style">Estilo</TabsTrigger>
            <TabsTrigger value="position">Posición</TabsTrigger>
            {selectedElement.type === 'table' && (
              <TabsTrigger value="data">Datos</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="style" className="space-y-3 pt-3">
            {/* Common Style Properties */}
            <div className="grid gap-2">
              <Label htmlFor="color">Color del texto</Label>
              <Input
                id="color"
                type="color"
                value={selectedElement.style.color || '#000000'}
                onChange={(e) => handleStyleChange('color', e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="backgroundColor">Color de fondo</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={selectedElement.style.backgroundColor || '#ffffff'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
              />
            </div>

            {selectedElement.type === 'text' && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="fontSize">Tamaño de fuente</Label>
                  <Select
                    value={selectedElement.style.fontSize || '16px'}
                    onValueChange={(value) => handleStyleChange('fontSize', value)}
                  >
                    <SelectTrigger id="fontSize">
                      <SelectValue placeholder="Tamaño de fuente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12px">12px</SelectItem>
                      <SelectItem value="14px">14px</SelectItem>
                      <SelectItem value="16px">16px</SelectItem>
                      <SelectItem value="18px">18px</SelectItem>
                      <SelectItem value="20px">20px</SelectItem>
                      <SelectItem value="24px">24px</SelectItem>
                      <SelectItem value="30px">30px</SelectItem>
                      <SelectItem value="36px">36px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fontFamily">Tipografía</Label>
                  <Select
                    value={selectedElement.style.fontFamily || 'Arial'}
                    onValueChange={(value) => handleStyleChange('fontFamily', value)}
                  >
                    <SelectTrigger id="fontFamily">
                      <SelectValue placeholder="Tipografía" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Alineación</Label>
                  <div className="flex space-x-1">
                    <Button
                      variant={selectedElement.style.textAlign === 'left' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange('textAlign', 'left')}
                      className="flex-1"
                    >
                      <AlignLeft size={16} />
                    </Button>
                    <Button
                      variant={selectedElement.style.textAlign === 'center' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange('textAlign', 'center')}
                      className="flex-1"
                    >
                      <AlignCenter size={16} />
                    </Button>
                    <Button
                      variant={selectedElement.style.textAlign === 'right' ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleChange('textAlign', 'right')}
                      className="flex-1"
                    >
                      <AlignRight size={16} />
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Estilo</Label>
                  <div className="flex space-x-1">
                    <Button
                      variant={selectedElement.style.fontWeight === 'bold' ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        handleStyleChange('fontWeight', 
                          selectedElement.style.fontWeight === 'bold' ? 'normal' : 'bold')
                      }
                      className="flex-1"
                    >
                      <Bold size={16} />
                    </Button>
                    <Button
                      variant={selectedElement.style.fontStyle === 'italic' ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        handleStyleChange('fontStyle', 
                          selectedElement.style.fontStyle === 'italic' ? 'normal' : 'italic')
                      }
                      className="flex-1"
                    >
                      <Italic size={16} />
                    </Button>
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="padding">Padding</Label>
              <Select
                value={selectedElement.style.padding || '0px'}
                onValueChange={(value) => handleStyleChange('padding', value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue placeholder="Padding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0px">0px</SelectItem>
                  <SelectItem value="2px">2px</SelectItem>
                  <SelectItem value="4px">4px</SelectItem>
                  <SelectItem value="8px">8px</SelectItem>
                  <SelectItem value="12px">12px</SelectItem>
                  <SelectItem value="16px">16px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="border">Borde</Label>
              <Select
                value={selectedElement.style.border || 'none'}
                onValueChange={(value) => handleStyleChange('border', value)}
              >
                <SelectTrigger id="border">
                  <SelectValue placeholder="Borde" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Ninguno</SelectItem>
                  <SelectItem value="1px solid black">Delgado</SelectItem>
                  <SelectItem value="2px solid black">Mediano</SelectItem>
                  <SelectItem value="3px solid black">Grueso</SelectItem>
                  <SelectItem value="1px dashed black">Discontinuo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="borderRadius">Redondeo de bordes</Label>
              <Select
                value={selectedElement.style.borderRadius || '0px'}
                onValueChange={(value) => handleStyleChange('borderRadius', value)}
              >
                <SelectTrigger id="borderRadius">
                  <SelectValue placeholder="Redondeo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0px">0px</SelectItem>
                  <SelectItem value="2px">2px</SelectItem>
                  <SelectItem value="4px">4px</SelectItem>
                  <SelectItem value="6px">6px</SelectItem>
                  <SelectItem value="8px">8px</SelectItem>
                  <SelectItem value="12px">12px</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="position" className="space-y-3 pt-3">
            <div className="grid gap-2">
              <Label htmlFor="position-x">Posición X</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="position-x"
                  type="number"
                  value={selectedElement.x}
                  onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                  className="w-20"
                />
                <Slider
                  value={[selectedElement.x]}
                  min={0}
                  max={700}
                  step={1}
                  onValueChange={([value]) => handlePositionChange('x', value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="position-y">Posición Y</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="position-y"
                  type="number"
                  value={selectedElement.y}
                  onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                  className="w-20"
                />
                <Slider
                  value={[selectedElement.y]}
                  min={0}
                  max={1000}
                  step={1}
                  onValueChange={([value]) => handlePositionChange('y', value)}
                  className="flex-1"
                />
              </div>
            </div>

            {(selectedElement.type === 'table') && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="width">Ancho</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="width"
                      type="number"
                      value={selectedElement.width || 400}
                      onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 100)}
                      className="w-20"
                    />
                    <Slider
                      value={[selectedElement.width || 400]}
                      min={100}
                      max={780}
                      step={10}
                      onValueChange={([value]) => handleSizeChange('width', value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="height">Alto</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="height"
                      type="number"
                      value={selectedElement.height || 200}
                      onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 50)}
                      className="w-20"
                    />
                    <Slider
                      value={[selectedElement.height || 200]}
                      min={50}
                      max={500}
                      step={10}
                      onValueChange={([value]) => handleSizeChange('height', value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {selectedElement.type === 'table' && (
            <TabsContent value="data" className="space-y-3 pt-3">
              <div className="text-sm font-medium mb-2">Columnas de la tabla</div>
              {(selectedElement as TableElement).columns.map((column, index) => (
                <div key={index} className="border p-2 rounded-md mb-2">
                  <div className="grid gap-2 mb-2">
                    <Label htmlFor={`col-header-${index}`}>Título</Label>
                    <Input
                      id={`col-header-${index}`}
                      value={column.header}
                      onChange={(e) => handleColumnUpdate(index, { header: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2 mb-2">
                    <Label htmlFor={`col-width-${index}`}>Ancho</Label>
                    <Input
                      id={`col-width-${index}`}
                      type="number"
                      value={column.width}
                      onChange={(e) => handleColumnUpdate(index, { width: parseInt(e.target.value) || 50 })}
                    />
                  </div>
                </div>
              ))}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;