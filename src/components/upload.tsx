"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileJson, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type UploadStatus = "idle" | "uploading" | "error"

interface FileUploaderProps {
  onFileUploaded: (content: any, fileName: string, fileSize: number) => void
}

export function FileUploader({ onFileUploaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      handleFileSelection(droppedFile)
    }
  }

  const handleFileSelection = (selectedFile: File) => {
    // Reset states
    setErrorMessage("")

    // Check if file is JSON
    if (!selectedFile.name.endsWith(".json")) {
      setErrorMessage("Por favor, sube un archivo JSON válido")
      setUploadStatus("error")
      return
    }

    setUploadStatus("uploading")

    // Simulate upload process
    setTimeout(() => {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const content = JSON.parse(event.target?.result as string)
          onFileUploaded(content, selectedFile.name, selectedFile.size)
          setUploadStatus("idle")
        } catch (error) {
          setErrorMessage("El archivo no contiene JSON válido")
          setUploadStatus("error")
        }
      }

      reader.onerror = () => {
        setErrorMessage("Error al leer el archivo")
        setUploadStatus("error")
      }

      reader.readAsText(selectedFile)
    }, 1000)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0])
    }
  }

  const resetUploader = () => {
    setUploadStatus("idle")
    setErrorMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card
      className={cn(
        "border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out",
        isDragging ? "border-primary bg-primary/5" : "border-gray-200",
        uploadStatus === "error" ? "border-red-500 bg-red-50" : "",
      )}
    >
      <div
        className="flex flex-col items-center justify-center space-y-4 text-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadStatus === "idle" && (
          <>
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <FileJson className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Arrastra tu archivo JSON aquí</h3>
              <p className="text-sm text-muted-foreground mt-1">o haz clic en el botón para seleccionar un archivo</p>
            </div>
            <Button onClick={handleButtonClick} className="mt-4">
              <Upload className="mr-2 h-4 w-4" />
              Seleccionar archivo
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleInputChange} accept=".json" className="hidden" />
          </>
        )}

        {uploadStatus === "uploading" && (
          <div className="py-8">
            <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-medium">Procesando archivo...</p>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="py-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-red-700">Error al cargar el archivo</h3>
            <p className="text-sm text-red-500 mt-1 mb-4">{errorMessage}</p>
            <Button variant="outline" onClick={resetUploader} className="mt-2">
              Intentar de nuevo
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

