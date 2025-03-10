"use client"

import { useState } from "react"
import { FileUploader } from "../components/upload"
import { JsonPreviewPanel } from "../components/json-preview-panel"
import Editor from "../components/editor";

export default function Home() {
  const [jsonContent, setJsonContent] = useState<any>(null)
  const [fileName, setFileName] = useState<string>("")
  const [fileSize, setFileSize] = useState<number>(0)

  const handleFileUploaded = (content: any, name: string, size: number) => {
    setJsonContent(content)
    setFileName(name)
    setFileSize(size)
  }

  return (
    <main className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Contenido principal */}
        <Editor />
    </main>
  )
}

