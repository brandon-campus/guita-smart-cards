import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, Camera, FileText, X, Check, AlertCircle } from "lucide-react";
import { CreditCard } from "@/types/creditCard";
import { OCRService, ExtractedData } from "@/services/ocrService";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

interface StatementScannerProps {
  card: CreditCard;
  onDataExtracted: (cardId: string, data: ExtractedData) => void;
  onClose: () => void;
}

export const StatementScanner = ({ card, onDataExtracted, onClose }: StatementScannerProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Archivo no válido",
        description: "Por favor selecciona una imagen (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const processStatement = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(10);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 85));
      }, 500);

      const data = await OCRService.processStatement(selectedFile);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setExtractedData(data);
      
      toast({
        title: "¡Datos extraídos exitosamente!",
        description: "Revisa la información detectada antes de actualizar la tarjeta",
      });
    } catch (error) {
      toast({
        title: "Error al procesar el resumen",
        description: error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const applyExtractedData = () => {
    if (!extractedData) return;
    
    onDataExtracted(card.id, extractedData);
    toast({
      title: "Tarjeta actualizada",
      description: "Los datos han sido actualizados exitosamente",
    });
    onClose();
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setPreview(null);
    setExtractedData(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto gradient-card border-border/50 shadow-glow">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Escanear resumen</h2>
              <p className="text-sm text-muted-foreground">
                {card.bankName} •••• {card.lastFourDigits}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* File Upload Area */}
          {!selectedFile && (
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center transition-smooth hover:border-primary/50 hover:bg-accent/5"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
            >
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-primary/10 inline-block">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Sube una foto del resumen
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="gradient"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                      Seleccionar archivo
                    </Button>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          )}

          {/* Preview and Processing */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Imagen seleccionada</Label>
                <Button variant="ghost" size="sm" onClick={resetScanner}>
                  <X className="h-4 w-4" />
                  Cambiar
                </Button>
              </div>
              
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg border border-border"
                  />
                </div>
              )}

              {/* Processing */}
              {isProcessing && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary animate-pulse" />
                      <span className="text-sm font-medium text-foreground">
                        Procesando resumen...
                      </span>
                    </div>
                    <Progress value={progress} variant="credit" animated />
                    <p className="text-xs text-muted-foreground">
                      Extrayendo datos del resumen de tarjeta
                    </p>
                  </div>
                </Card>
              )}

              {/* Extracted Data Preview */}
              {extractedData && (
                <Card className="p-4 bg-success/5 border-success/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Check className="h-5 w-5 text-success" />
                      <span className="font-medium text-success">Datos extraídos</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {extractedData.creditLimit && (
                        <div>
                          <span className="text-muted-foreground">Límite de crédito:</span>
                          <p className="font-medium text-foreground">
                            {formatCurrency(extractedData.creditLimit)}
                          </p>
                        </div>
                      )}
                      
                      {extractedData.currentBalance && (
                        <div>
                          <span className="text-muted-foreground">Saldo actual:</span>
                          <p className="font-medium text-foreground">
                            {formatCurrency(extractedData.currentBalance)}
                          </p>
                        </div>
                      )}
                      
                      {extractedData.availableCredit && (
                        <div>
                          <span className="text-muted-foreground">Crédito disponible:</span>
                          <p className="font-medium text-success">
                            {formatCurrency(extractedData.availableCredit)}
                          </p>
                        </div>
                      )}
                      
                      {extractedData.minimumPayment && (
                        <div>
                          <span className="text-muted-foreground">Pago mínimo:</span>
                          <p className="font-medium text-foreground">
                            {formatCurrency(extractedData.minimumPayment)}
                          </p>
                        </div>
                      )}
                      
                      {extractedData.dueDate && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Fecha de vencimiento:</span>
                          <p className="font-medium text-foreground">
                            {new Date(extractedData.dueDate).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      )}
                    </div>

                    {Object.keys(extractedData).length === 0 && (
                      <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-warning" />
                        <span className="text-sm text-warning-foreground">
                          No se pudieron extraer datos específicos. Intenta con una imagen más clara.
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!extractedData && !isProcessing && (
                  <Button
                    onClick={processStatement}
                    variant="gradient"
                    size="lg"
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4" />
                    Procesar resumen
                  </Button>
                )}
                
                {extractedData && (
                  <>
                    <Button
                      onClick={applyExtractedData}
                      variant="gradient"
                      size="lg"
                      className="flex-1"
                      disabled={Object.keys(extractedData).length === 0}
                    >
                      <Check className="h-4 w-4" />
                      Aplicar cambios
                    </Button>
                    <Button
                      onClick={resetScanner}
                      variant="outline"
                      size="lg"
                    >
                      Reintentar
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};