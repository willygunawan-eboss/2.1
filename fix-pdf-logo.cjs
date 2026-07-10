const fs = require('fs');
let content = fs.readFileSync('src/components/InvoicingView.tsx', 'utf8');

const regex = /const generatePDF = \(inv: Invoice\) => \{([\s\S]*?)doc\.save\(\`\\\$\\\{fullInv.invoiceNumber\\\}.pdf\`\);\n      \}\);\n  \};/;

if (content.match(regex)) {
  const newPdfLogic = `const generatePDF = (inv: Invoice) => {
    const renderPdfContent = (doc: jsPDF, inv: Invoice, fullInv: any) => {
        // Header
        doc.setFontSize(24);
        doc.setTextColor(50, 100, 180);
        doc.text("Invoice", 150, 25);
        
        // Invoice info
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text("Referensi", 130, 40); doc.text(inv.invoiceNumber, 170, 40, { align: 'right' });
        doc.text("Tanggal", 130, 45); doc.text(new Date(inv.date).toLocaleDateString('id-ID'), 170, 45, { align: 'right' });
        doc.text("Tgl. Jatuh Tempo", 130, 50); doc.text(new Date(inv.dueDate).toLocaleDateString('id-ID'), 170, 50, { align: 'right' });

        // Company Info
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Info Perusahaan", 14, 65);
        doc.line(14, 67, 90, 67);
        doc.setFontSize(10);
        doc.text("ichangeboss", 14, 75);
        doc.setFont("helvetica", "normal");
        doc.text("Jalan Tebet Timur 12820,\\nKota Jakarta Selatan,\\nDKI Jakarta,\\nTelp: 081282283600\\nEmail: achmad.rizaldy@transvision.co.id", 14, 82);

        // Customer Info
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Tagihan Untuk", 110, 65);
        doc.line(110, 67, 190, 67);
        doc.setFontSize(10);
        doc.text(inv.customerName, 110, 75);
        doc.setFont("helvetica", "normal");
        doc.text(\`Telp: \${inv.customerPhone || '-'}\\nEmail: \${inv.customerEmail || '-'}\`, 110, 82);

        const items = fullInv.items || [];
        
        autoTable(doc, {
          startY: 110,
          head: [['Produk', 'Deskripsi', 'Kuantitas', 'Harga (Rp)', 'Diskon', 'Pajak', 'Jumlah (Rp)']],
          body: items.map((it: any) => [
            it.productName,
            it.description || '-',
            it.quantity.toString(),
            it.price.toLocaleString('id-ID'),
            it.discountPercent.toString(),
            it.taxType === 'No Tax Selected' ? '-' : it.taxType,
            it.total.toLocaleString('id-ID')
          ]),
          headStyles: { fillColor: [50, 70, 90], textColor: 255 },
          styles: { fontSize: 9, cellPadding: 4 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 50 },
            2: { halign: 'center' },
            3: { halign: 'right' },
            4: { halign: 'center' },
            6: { halign: 'right' },
          }
        });

        const finalY = (doc as any).lastAutoTable.finalY || 110;
        
        // Summary box
        doc.text("Subtotal", 130, finalY + 10); doc.text(fullInv.subtotal.toLocaleString('id-ID'), 190, finalY + 10, { align: 'right' });
        doc.text("Total Diskon", 130, finalY + 15); doc.text(fullInv.discountTotal.toLocaleString('id-ID'), 190, finalY + 15, { align: 'right' });
        doc.text("Pajak", 130, finalY + 20); doc.text(fullInv.taxTotal.toLocaleString('id-ID'), 190, finalY + 20, { align: 'right' });
        doc.setFont("helvetica", "bold");
        doc.text("Total", 130, finalY + 30); doc.text(fullInv.total.toLocaleString('id-ID'), 190, finalY + 30, { align: 'right' });
        
        if (fullInv.downPayment > 0) {
          doc.text("Uang Muka", 130, finalY + 40); doc.text(fullInv.downPayment.toLocaleString('id-ID'), 190, finalY + 40, { align: 'right' });
          doc.text("Sisa Tagihan", 130, finalY + 50); doc.text(fullInv.amountDue.toLocaleString('id-ID'), 190, finalY + 50, { align: 'right' });
        }

        // Notes and terms
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Keterangan", 14, finalY + 20);
        doc.line(14, finalY + 22, 100, finalY + 22);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const splitNotes = doc.splitTextToSize(fullInv.notes || '', 80);
        doc.text(splitNotes, 14, finalY + 27);

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Syarat & Ketentuan", 14, finalY + 50);
        doc.line(14, finalY + 52, 100, finalY + 52);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const splitTerms = doc.splitTextToSize(fullInv.terms || '', 80);
        doc.text(splitTerms, 14, finalY + 57);

        // Signature
        doc.text(new Date(fullInv.signatureDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 150, finalY + 80, { align: 'center' });
        doc.text(fullInv.signatureName || '-', 150, finalY + 110, { align: 'center' });

        doc.save(\`\${fullInv.invoiceNumber}.pdf\`);
    };

    fetch(\`/api/invoices/\${inv.id}\`)
      .then(res => res.json())
      .then(json => {
        const fullInv = json.data;
        const doc = new jsPDF();
        
        const img = new Image();
        img.src = '/logo.png';
        img.onload = () => {
           try {
             doc.addImage(img, 'PNG', 14, 15, 30, 30);
           } catch (e) {
             console.log("Error adding image to PDF", e);
             doc.setFillColor(240, 248, 255);
             doc.rect(14, 15, 30, 30, 'F');
             doc.setFontSize(10);
             doc.setTextColor(0, 102, 204);
             doc.text("ICHANGEBOSS", 15, 30);
           }
           renderPdfContent(doc, inv, fullInv);
        };
        img.onerror = () => {
           doc.setFillColor(240, 248, 255);
           doc.rect(14, 15, 30, 30, 'F');
           doc.setFontSize(10);
           doc.setTextColor(0, 102, 204);
           doc.text("ICHANGEBOSS", 15, 30);
           renderPdfContent(doc, inv, fullInv);
        };
      });
  };`;
  content = content.replace(regex, newPdfLogic);
  fs.writeFileSync('src/components/InvoicingView.tsx', content);
}
