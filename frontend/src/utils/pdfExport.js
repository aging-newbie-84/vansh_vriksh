import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PAPER_MM = {
  a0: { w: 1189, h: 841 },
  a1: { w: 841,  h: 594 },
  a2: { w: 594,  h: 420 },
  a3: { w: 420,  h: 297 },
};

/**
 * Captures the PrintCanvas element and exports as a landscape PDF.
 *
 * @param {HTMLElement} el      — the PrintCanvas DOM node (already sized for the target format)
 * @param {string}      name    — base filename (no extension)
 * @param {'a0'|'a1'|'a2'|'a3'} format
 */
export async function exportTreeAsPDF(el, name = 'vansh-vriksha', format = 'a3') {
  if (!el) {
    console.error('exportTreeAsPDF: element not found');
    alert('Could not generate PDF. Please try again.');
    return;
  }

  // Ensure all web fonts (Cinzel Decorative, IM Fell English, etc.) are fully loaded
  await document.fonts.ready;

  const size = PAPER_MM[format?.toLowerCase()] || PAPER_MM.a3;
  const scale = format === 'a0' || format === 'a1' ? 3 : 2.5;

  try {
    const canvas = await html2canvas(el, {
      scale,
      backgroundColor: '#FDF3E3',
      useCORS: true,
      logging: false,
      allowTaint: true,
      imageTimeout: 0,
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [size.w, size.h],
    });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    // PrintCanvas is pre-sized for the paper — fill the page exactly
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);

    pdf.save(`${name}-${format.toUpperCase()}-${Date.now()}.pdf`);
  } catch (err) {
    console.error('PDF export failed:', err);
    alert('PDF generation failed. Please try again.');
  }
}
