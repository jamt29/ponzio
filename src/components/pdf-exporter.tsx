// components/PdfExporter.tsx

import React, { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { 
  DownloadCloud, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";

interface PdfExporterProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  fileName?: string;
}

const PdfExporter: React.FC<PdfExporterProps> = ({ 
  canvasRef, 
  fileName = "documento" 
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async () => {
    if (!canvasRef.current) {
      toast.error("No se pudo encontrar el contenido para exportar");
      return;
    }

    try {
      setIsExporting(true);

      // Configuración para generar PDF de alta calidad
      const canvas = await html2canvas(canvasRef.current, {
        scale: 2, // Escala más alta para mejor calidad
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // Medidas de A4 en mm (210 x 297)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Calcular dimensiones manteniendo proporciones
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Manejar documentos de múltiples páginas
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        page++;
      }

      // Generar nombre de archivo con fecha
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
      pdf.save(`${fileName}-${timestamp}.pdf`);

      toast.success("PDF generado correctamente");
    } catch (error) {
      console.error("Error al exportar a PDF:", error);
      toast.error("Error al exportar a PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToPdf}
      disabled={isExporting}
      className="flex items-center space-x-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <DownloadCloud className="h-4 w-4" />
      )}
      <span>{isExporting ? "Generando PDF..." : "Exportar a PDF"}</span>
    </Button>
  );
};

export default PdfExporter;