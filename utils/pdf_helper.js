const makePdf = (options) => {
  const { PdfMakePrinter } = options;
  const documentFonts = {
    Roboto: {
      normal: './fonts/Roboto-Regular.ttf',
      bold: './fonts/Roboto-Medium.ttf',
      italics: './fonts/Roboto-Italic.ttf',
    },
  };

  const documentStyles = {
    header: {
      fontSize: 18,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'center',
    },
    subheader: {
      fontSize: 14,
      bold: true,
      margin: [0, 10, 0, 5],
      alignment: 'center',
    },
    tableExample: {
      margin: [0, 10, 0, 10],
      alignment: 'center',
    },
    tableHeader: {
      bold: true,
      fontSize: 13,
      color: 'black',
    },
  };

  const generatePdfWithTables = (documentContent) => new Promise((resolve, reject) => {
    try {
      const data = {
        content: documentContent,
        styles: documentStyles,
      };
      const printer = new PdfMakePrinter(documentFonts);
      const document = printer.createPdfKitDocument(data);
      const chunks = [];
      let result;

      document.on('data', (chunk) => {
        chunks.push(chunk);
      });

      document.on('end', () => {
        result = Buffer.concat(chunks);
        resolve(result);
      });
      document.end();
    } catch (error) {
      reject(error);
    }
  });
  return Object.create({
    generatePdfWithTables,
  });
};


module.exports = makePdf;
