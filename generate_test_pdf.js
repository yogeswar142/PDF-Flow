const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { height } = page.getSize();
  
  page.drawText('Hello PDF Flow World', {
    x: 50,
    y: height - 50,
    size: 30,
    color: rgb(0, 0, 0),
  });

  page.drawText('This is a test for extraction.', {
    x: 50,
    y: height - 100,
    size: 15,
    color: rgb(0, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('test.pdf', pdfBytes);
  console.log('test.pdf created');
}

createPdf();
