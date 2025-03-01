const PDFDocument = require("pdfkit");
const fs = require("fs");

const generatePDF = async (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    let fileName = `output.pdf`;

    // Writing the PDF content
    doc.fontSize(20).text("User Details", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${data.name}`);
    doc.text(`Email: ${data.email}`);
    doc.text(`Phone: ${data.phone}`);
    doc.text(`Address: ${data.address}`);

    // Saving PDF in buffer
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    doc.end();
  });
};

module.exports = generatePDF;
