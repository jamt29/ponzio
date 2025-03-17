// pages/editor.tsx

import React, { useState, useRef, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { EditorElement } from "@/types/editor.types";
import JsonFieldExplorer from "@/components/json-field-explorer";
import EditorCanvas from "@/components/editor-canvas";
import PropertiesPanel from "@/components/propierties-panel";
import PdfExporter from "@/components/pdf-exporter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "sonner";
import { 
  Upload, 
  Save, 
  FileJson,
  Trash 
} from "lucide-react";

const Editor = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState("Documento sin título");
  const [templates, setTemplates] = useState<{ name: string; elements: EditorElement[] }[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejar carga de archivo JSON
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setJsonData(json);
        
        // Resetear el editor al cargar un nuevo JSON
        setElements([]);
        setSelectedElementId(null);
      } catch (error) {
        console.error("Error al parsear el JSON:", error);
        alert("El archivo no contiene un JSON válido.");
      };
      
    };
    reader.readAsText(file);
};

  // Obtener el elemento seleccionado
  const selectedElement = elements.find(el => el.id === selectedElementId) || null;

  // Actualizar un elemento
  const handleElementUpdate = useCallback((updates: Partial<EditorElement>) => {
    if (!selectedElementId) return;
    
    setElements(prev => 
      prev.map(el => el.id === selectedElementId ? { ...el, ...updates } as EditorElement : el)
    );
  }, [selectedElementId]);
  
  // Guardar la plantilla actual
  const saveTemplate = () => {
    const templateName = prompt("Nombre de la plantilla:", documentName);
    if (!templateName) return;
    
    setTemplates(prev => [
        ...prev,
        { name: templateName, elements: [...elements] }
    ]);
    
    // También podríamos guardar en localStorage o en una base de datos
    try {
        localStorage.setItem('pdf-templates', JSON.stringify([
            ...templates,
            { name: templateName, elements: [...elements] }
        ]));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage", e);
    }
};

  // Cargar una plantilla
  const loadTemplate = (index: number) => {
      if (!templates[index]) return;
      
    if (confirm("¿Cargar esta plantilla? Se perderán los cambios no guardados.")) {
      setElements(templates[index].elements);
      setDocumentName(templates[index].name);
    }
  };

  // Limpiar el editor
  const clearEditor = () => {
    if (elements.length === 0 || confirm("¿Eliminar todos los elementos?")) {
        setElements([]);
        setSelectedElementId(null);
    }
};

// Cargar plantillas guardadas al iniciar
  React.useEffect(() => {
    try {
      const savedTemplates = localStorage.getItem('pdf-templates');
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
    }
} catch (e) {
    console.warn("Error al cargar plantillas guardadas", e);
    }
}, []);

return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen">
        {/* Barra de herramientas superior */}
        <header className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-lg font-medium"
                />
              
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                  >
                  <Upload size={16} />
                  <span>Cargar JSON</span>
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                onClick={saveTemplate}
                className="flex items-center space-x-2"
                disabled={elements.length === 0}
              >
                <Save size={16} />
                <span>Guardar plantilla</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={clearEditor}
                className="flex items-center space-x-2"
                >
                <Trash size={16} />
                <span>Limpiar</span>
              </Button>
            </div>
            
            <div>
              <PdfExporter canvasRef={canvasRef} fileName={documentName} />
            </div>
          </div>
        </header>
        
        {/* Área principal */}
        <div className="flex flex-1 overflow-hidden">
          {/* Panel izquierdo */}
          <div className="w-80 border-r bg-gray-50 flex flex-col overflow-hidden">
            {jsonData ? (
              <JsonFieldExplorer jsonData={jsonData} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <FileJson size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Carga un archivo JSON</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Para comenzar, carga un archivo JSON con los datos que deseas visualizar.
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="default"
                  >
                  Seleccionar archivo
                </Button>
              </div>
            )}
          </div>
          
          {/* Editor central */}
          <div className="flex-1 overflow-auto bg-gray-100">
            <EditorCanvas
              elements={elements}
              onElementsChange={setElements}
              onElementSelect={(element) => setSelectedElementId(element?.id || null)}
              selectedElementId={selectedElementId}
              ref={canvasRef}
            />
          </div>
          
          {/* Panel derecho */}
          <div className="w-64 border-l bg-gray-50 overflow-auto">
            <PropertiesPanel
              selectedElement={selectedElement}
              onElementUpdate={handleElementUpdate}
            />
          </div>
        </div>
      </div>
      
      <Toaster />
    </DndProvider>
  );
}

export default Editor;