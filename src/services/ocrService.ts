import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

export interface ExtractedData {
  totalSpent?: number;
  availableCredit?: number;
  minimumPayment?: number;
  dueDate?: string;
  creditLimit?: number;
  currentBalance?: number;
}

export class OCRService {
  private static ocrPipeline: any = null;

  static async initializeOCR() {
    if (!this.ocrPipeline) {
      console.log('Initializing OCR pipeline...');
      try {
        this.ocrPipeline = await pipeline(
          'image-to-text',
          'Xenova/trocr-base-printed',
          { device: 'webgpu' }
        );
        console.log('OCR pipeline initialized successfully');
      } catch (error) {
        console.warn('WebGPU not available, falling back to CPU');
        this.ocrPipeline = await pipeline(
          'image-to-text',
          'Xenova/trocr-base-printed'
        );
      }
    }
    return this.ocrPipeline;
  }

  static async extractTextFromImage(imageFile: File): Promise<string> {
    try {
      console.log('Extracting text from image...');
      const ocr = await this.initializeOCR();
      
      // Convert file to image element
      const imageUrl = URL.createObjectURL(imageFile);
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            const result = await ocr(img);
            const extractedText = result?.generated_text || '';
            console.log('Extracted text:', extractedText);
            URL.revokeObjectURL(imageUrl);
            resolve(extractedText);
          } catch (error) {
            console.error('Error during OCR processing:', error);
            URL.revokeObjectURL(imageUrl);
            reject(error);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          reject(new Error('Failed to load image'));
        };
        
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Error in extractTextFromImage:', error);
      throw error;
    }
  }

  static parseStatementData(text: string): ExtractedData {
    console.log('Parsing statement data from text:', text);
    
    const data: ExtractedData = {};
    const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');

    // Patterns for extracting financial data
    const patterns = {
      // Credit limit patterns
      creditLimit: [
        /(?:límite|limite|limit).*?[\$\s]*([0-9,\.]+)/i,
        /(?:credit limit).*?[\$\s]*([0-9,\.]+)/i,
      ],
      
      // Current balance patterns
      currentBalance: [
        /(?:saldo|balance|deuda).*?actual.*?[\$\s]*([0-9,\.]+)/i,
        /(?:current balance).*?[\$\s]*([0-9,\.]+)/i,
        /(?:deuda total).*?[\$\s]*([0-9,\.]+)/i,
      ],
      
      // Available credit patterns
      availableCredit: [
        /(?:crédito|credito|credit).*?(?:disponible|available).*?[\$\s]*([0-9,\.]+)/i,
        /(?:available credit).*?[\$\s]*([0-9,\.]+)/i,
      ],
      
      // Minimum payment patterns
      minimumPayment: [
        /(?:pago|payment).*?(?:mínimo|minimo|minimum).*?[\$\s]*([0-9,\.]+)/i,
        /(?:minimum payment).*?[\$\s]*([0-9,\.]+)/i,
      ],
      
      // Due date patterns
      dueDate: [
        /(?:vencimiento|due date|fecha.*?pago).*?([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i,
        /([0-9]{1,2}[\/\-][0-9]{1,2}[\/\-][0-9]{2,4})/i,
      ]
    };

    // Extract each field
    for (const [field, fieldPatterns] of Object.entries(patterns)) {
      for (const pattern of fieldPatterns) {
        const match = normalizedText.match(pattern);
        if (match && match[1]) {
          if (field === 'dueDate') {
            // Parse and format date
            const dateStr = match[1].replace(/\-/g, '/');
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              data.dueDate = date.toISOString().split('T')[0];
            }
          } else {
            // Parse monetary amount
            const amount = parseFloat(match[1].replace(/[,\.]/g, ''));
            if (!isNaN(amount) && amount > 0) {
              (data as any)[field] = amount;
            }
          }
          break;
        }
      }
    }

    // Calculate missing fields if possible
    if (data.creditLimit && data.currentBalance && !data.availableCredit) {
      data.availableCredit = data.creditLimit - data.currentBalance;
    }

    if (data.currentBalance && !data.minimumPayment) {
      data.minimumPayment = Math.round(data.currentBalance * 0.05); // 5% default
    }

    console.log('Parsed data:', data);
    return data;
  }

  static async processStatement(imageFile: File): Promise<ExtractedData> {
    try {
      const extractedText = await this.extractTextFromImage(imageFile);
      return this.parseStatementData(extractedText);
    } catch (error) {
      console.error('Error processing statement:', error);
      throw new Error('No se pudo procesar el resumen. Intenta con una imagen más clara.');
    }
  }
}