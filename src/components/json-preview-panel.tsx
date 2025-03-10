"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface JsonPreviewPanelProps {
  jsonContent: any
  fileName: string
  fileSize: number
  onReset: () => void
}

export function JsonPreviewPanel({ jsonContent, fileName, fileSize, onReset }: JsonPreviewPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-10 flex",
        isExpanded ? "w-1/2 md:w-2/6" : "w-12",
      )}
    >
      {/* Botón para expandir/contraer */}
      <div className="w-12 h-full flex items-center justify-center border-r">
        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="rounded-full">
          {isExpanded ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Contenido del panel */}
      <div
        className={cn(
          "flex-1 flex flex-col h-full transition-all duration-300",
          isExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden",
        )}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h3 className="font-medium">Vista previa del JSON</h3>
            <p className="text-xs text-muted-foreground">
              {fileName} ({(fileSize / 1024).toFixed(2)} KB)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onReset} title="Cargar otro archivo">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <Card className="bg-gray-50 p-4 rounded-md h-full overflow-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(jsonContent, null, 2)}</pre>
          </Card>
        </div>
      </div>
    </div>
  )
}

