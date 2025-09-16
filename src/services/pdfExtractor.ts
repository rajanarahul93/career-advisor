/* eslint-disable @typescript-eslint/no-explicit-any */
import * as pdfjs from "pdfjs-dist";

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export class PDFExtractor {
  static async extractTextFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      let fullText = "";

      // Extract text from all pages (usually name is on first page)
      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 2); pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + " ";
      }

      return fullText;
    } catch (error) {
      console.error("Error extracting PDF text:", error);
      throw new Error("Failed to extract text from PDF");
    }
  }

  static extractNameFromText(text: string): string {
    try {
      // Clean and normalize text
      const cleanText = text.replace(/\s+/g, " ").trim();

      // Common patterns to find names in resumes
      const namePatterns = [
        // Pattern 1: Lines starting with capital letters (likely name)
        /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/m,

        // Pattern 2: After "Name:" or similar labels
        /(?:Name|Full Name|Candidate)\s*:?\s*([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,

        // Pattern 3: First line with 2-3 capital words
        /^([A-Z][A-Za-z]+(?: [A-Z][A-Za-z]+){1,2})\s/m,

        // Pattern 4: Between newlines, 2-3 capitalized words
        /\n([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\n/,
      ];

      for (const pattern of namePatterns) {
        const match = cleanText.match(pattern);
        if (match && match[1]) {
          const candidateName = match[1].trim();

          // Validate name (2-50 characters, only letters and spaces)
          if (
            candidateName.length >= 2 &&
            candidateName.length <= 50 &&
            /^[A-Za-z\s]+$/.test(candidateName) &&
            candidateName.split(" ").length >= 2
          ) {
            return candidateName;
          }
        }
      }

      // Fallback: Look for first occurrence of two capitalized words
      const words = cleanText.split(/\s+/);
      for (let i = 0; i < words.length - 1; i++) {
        const word1 = words[i];
        const word2 = words[i + 1];

        if (/^[A-Z][a-z]+$/.test(word1) && /^[A-Z][a-z]+$/.test(word2)) {
          return `${word1} ${word2}`;
        }
      }

      return "Candidate"; // Fallback if no name found
    } catch (error) {
      console.error("Error extracting name from text:", error);
      return "Candidate";
    }
  }

  static async extractNameFromPDF(file: File): Promise<string> {
    try {
      const text = await this.extractTextFromPDF(file);
      return this.extractNameFromText(text);
    } catch (error) {
      console.error("Error extracting name from PDF:", error);
      return "Candidate";
    }
  }
}