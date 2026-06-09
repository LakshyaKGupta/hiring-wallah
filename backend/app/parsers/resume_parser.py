import io
import fitz  # PyMuPDF
import pdfplumber
import logging

logger = logging.getLogger("hiring_wallah.resume_parser")

def parse_resume(pdf_bytes: bytes) -> str:
    """
    Extracts text from PDF bytes.
    Tries pdfplumber first, falls back to PyMuPDF (fitz) if pdfplumber fails or returns insufficient text.
    """
    text = ""
    
    # 1. Try pdfplumber
    try:
        logger.info("Attempting resume extraction with pdfplumber...")
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            extracted_pages = []
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_pages.append(page_text)
            text = "\n".join(extracted_pages).strip()
            
            if len(text) > 100:
                logger.info(f"Successfully extracted {len(text)} characters using pdfplumber.")
                return text
    except Exception as e:
        logger.warning(f"pdfplumber extraction failed: {e}. Falling back to PyMuPDF.")
        
    # 2. Fallback to PyMuPDF (fitz)
    try:
        logger.info("Attempting resume extraction with PyMuPDF...")
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        extracted_pages = []
        for page in doc:
            page_text = page.get_text()
            if page_text:
                extracted_pages.append(page_text)
        text = "\n".join(extracted_pages).strip()
        logger.info(f"Extracted {len(text)} characters using PyMuPDF fallback.")
        return text
    except Exception as e:
        logger.error(f"PyMuPDF extraction failed: {e}")
        return ""
