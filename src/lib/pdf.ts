

"use client";

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Customer, Delivery } from './types';

// Augment jsPDF with the autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateDeliveryNotePDF = async (delivery: Delivery, customer: Customer): Promise<string> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // 1. Header
  const headerYStart = 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PT. BINTANG SUKSES MULIA', pageWidth / 2, headerYStart, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Jl. Raya Jepara - Kudus Desa Krasak RT. 001 RW . 005', pageWidth / 2, headerYStart + 6, { align: 'center' });
  doc.text('Kec. Pecangaan, Kab. Jepara - Jawa Tengah', pageWidth / 2, headerYStart + 11, { align: 'center' });
  doc.text('Phone : 082 352 181 830', pageWidth / 2, headerYStart + 16, { align: 'center' });
  doc.text('E-mail : bintangsuksesmulia@hotmail.com', pageWidth / 2, headerYStart + 21, { align: 'center' });
  
  // Add a line separator
  const lineY = headerYStart + 25;
  doc.setLineWidth(0.5);
  doc.line(15, lineY, pageWidth - 15, lineY);

  // Main Title (Moved below header)
  const titleY = lineY + 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SURAT JALAN / DELIVERY NOTE', pageWidth / 2, titleY, { align: 'center' });


  // 2. Delivery Info
  const infoY = titleY + 15;
  const labelX = pageWidth - 70;
  const colonX = labelX + 30;
  const valueX = colonX + 2;

  doc.setFontSize(10);
  
  // Left column
  doc.setFont('helvetica', 'bold');
  doc.text('Kepada Yth:', 15, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(delivery.customerName, 15, infoY + 5);
  const addressText = doc.splitTextToSize(customer?.address || '', 80);
  doc.text(addressText, 15, infoY + 10);
  const addressHeight = doc.getTextDimensions(addressText).h;
  doc.text(customer?.phone || '', 15, infoY + 10 + addressHeight + 2); // Add more space here
  
  // Right column - Aligned colons
  doc.setFont('helvetica', 'bold');
  doc.text('Tanggal Kirim', labelX, infoY);
  doc.text('No. Surat Jalan', labelX, infoY + 5);
  doc.text('No. Kendaraan', labelX, infoY + 10);
  doc.text('Berat Muatan', labelX, infoY + 15);
  
  doc.text(':', colonX, infoY);
  doc.text(':', colonX, infoY + 5);
  doc.text(':', colonX, infoY + 10);
  doc.text(':', colonX, infoY + 15);

  doc.setFont('helvetica', 'normal');
  doc.text(new Date(delivery.deliveryDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }), valueX, infoY);
  doc.text(delivery.deliveryNoteNumber, valueX, infoY + 5);
  doc.text(delivery.vehicleNumber || '', valueX, infoY + 10);
  doc.text('', valueX, infoY + 15);
  

  // 3. Table of Items
  const tableColumn = ["No.", "Nama Barang", "No. PO", "Ukuran", "Jumlah"];
  const tableRows: any[][] = [];

  delivery.items.forEach((item, index) => {
    const size = item.finishedSize 
      ? (item.type === 'Box' 
          ? `${item.finishedSize.length} x ${item.finishedSize.width} x ${item.finishedSize.height} cm`
          : `${item.finishedSize.length} x ${item.finishedSize.width} cm`)
      : '-';

    const itemData = [
      index + 1,
      item.name,
      item.poNumber,
      size,
      `${item.quantity.toLocaleString()} pcs`,
    ];
    tableRows.push(itemData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: infoY + 30, // Start table after info section
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74] },
    columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        4: { halign: 'right' },
    }
  });
  
  let finalY = (doc as any).lastAutoTable.finalY || 100;

  // 4. Footer & Signature
  const signatureY = finalY + 15;
  const signatureX = {
      sender: 30,
      driver: pageWidth / 2,
      receiver: pageWidth - 30
  }

  doc.setFontSize(10);
  doc.text('Hormat Kami,', signatureX.sender, signatureY, { align: 'center' });
  doc.text('Pengirim,', signatureX.driver, signatureY, { align: 'center' });
  doc.text('Penerima,', signatureX.receiver, signatureY, { align: 'center' });

  const signatureLineY = signatureY + 20;
  doc.text('(_________________)', signatureX.sender, signatureLineY, { align: 'center' });
  doc.text(`(${delivery.driverName || '_________________'})`, signatureX.driver, signatureLineY, { align: 'center' });
  doc.text('(_________________)', signatureX.receiver, signatureLineY, { align: 'center' });


  // Return the PDF as a data URI
  return doc.output('datauristring');
};
