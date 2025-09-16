/* eslint-disable @typescript-eslint/no-explicit-any */
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

export type ExportFormat = 'json' | 'pdf';

interface ExportOptions {
  filename: string;
  format: ExportFormat;
  data?: any;
  elementId?: string;
}

export class ExportService {
  // Export JSON data (unchanged)
  static exportJSON(data: any, filename: string) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Export PDF from data (unchanged)
  static exportPDFFromData(data: any, filename: string) {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Career Advisor Export', 20, 20);
    
    // Add timestamp
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    
    // Add data content
    pdf.setFontSize(12);
    const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const lines = pdf.splitTextToSize(content, 170);
    
    let yPosition = 40;
    const pageHeight = pdf.internal.pageSize.height;
    
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 20, yPosition);
      yPosition += 6;
    });
    
    pdf.save(`${filename}.pdf`);
  }

  // ✅ UPDATED: Enhanced PDF export with better error handling
  static async exportPDFFromElement(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    try {
      // ✅ Enhanced html2canvas-pro options
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#111827',
        ignoreElements: (element) => {
          // Skip elements that might cause issues
          return element.classList.contains('no-export');
        },
        // ✅ NEW: Better color handling
        foreignObjectRendering: true,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let y = 10; // Start position

      // Add title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Career Advisor Export', 10, y);
      y += 10;
      
      // Add timestamp
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, y);
      y += 10;

      // Add the image
      if (imgHeight > pdfHeight - y) {
        // Multi-page handling
        let remainingHeight = imgHeight;
        let sourceY = 0;
        
        while (remainingHeight > 0) {
          const currentPageHeight = Math.min(remainingHeight, pdfHeight - y);
          const sourceHeight = (currentPageHeight / imgHeight) * canvas.height;
          
          // Create a temporary canvas for this page section
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
            const tempImgData = tempCanvas.toDataURL('image/png', 1.0);
            pdf.addImage(tempImgData, 'PNG', 10, y, imgWidth, currentPageHeight);
          }
          
          remainingHeight -= currentPageHeight;
          sourceY += sourceHeight;
          
          if (remainingHeight > 0) {
            pdf.addPage();
            y = 10;
          }
        }
      } else {
        // Single page
        pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight);
      }

      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  // Main export function (unchanged)
  static async export(options: ExportOptions) {
    const { filename, format, data, elementId } = options;

    try {
      if (format === 'json') {
        this.exportJSON(data, filename);
      } else if (format === 'pdf') {
        if (elementId) {
          await this.exportPDFFromElement(elementId, filename);
        } else {
          this.exportPDFFromData(data, filename);
        }
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  }
}