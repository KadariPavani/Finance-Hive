import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs; // Ensure proper assignment

export const generateReceiptPDF = (receipt) => {
  const docDefinition = {
    content: [
      { text: 'FINANCE HIVE', style: 'header' },
      { text: 'Payment Receipt', style: 'subheader' },
      {
        columns: [
          { text: `Receipt No: ${receipt.receiptNumber}`, width: '*' },
          { text: `Date: ${new Date(receipt.paymentDate).toLocaleDateString()}`, width: '*' }
        ]
      },
      { text: '\n' },
      {
        table: {
          widths: ['*', '*'],
          body: [
            ['Payer Name', receipt.user.name],
            ['Mobile Number', receipt.user.mobileNumber],
            ['EMI Number', `#${receipt.serialNo}`],
            ['Amount Paid', receipt.amount.toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR'
            })],
            ['Payment Method', receipt.paymentMethod]
          ]
        }
      },
      { text: '\n\n' },
      { 
        text: 'Payment Terms:',
        style: 'termsHeader',
        margin: [0, 20, 0, 5]
      },
      {
        ul: [
          'This is a computer-generated receipt',
          'Valid without signature',
          'Subject to FINANCE HIVE terms and conditions'
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 24,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      subheader: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },
      termsHeader: {
        bold: true,
        decoration: 'underline'
      }
    },
    defaultStyle: {
      font: 'Roboto' // Use 'Roboto' instead of 'Helvetica'
    }
  };

  const pdfDoc = pdfMake.createPdf(docDefinition);
  pdfDoc.download(`Receipt_${receipt.receiptNumber}.pdf`);
};
