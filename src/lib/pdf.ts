

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
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // 1. Header Section
  const headerRectHeight = 30;
  doc.setFillColor(240, 240, 240); // Light gray background
  doc.rect(0, 0, pageWidth, headerRectHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('PT. BINTANG SUKSES MULIA', margin, 15);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Jl. Raya Jepara - Kudus Desa Krasak RT. 001 RW . 005', margin, 21);
  doc.text('Kec. Pecangaan, Kab. Jepara - Jawa Tengah', margin, 25);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SURAT JALAN', pageWidth - margin, 20, { align: 'right' });


  // 2. Delivery Info Section
  const infoYStart = headerRectHeight + 12;
  const boxWidth = (pageWidth - (margin * 3)) / 2;

  // Customer Info Box
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Kepada Yth:', margin, infoYStart);
  doc.setFont('helvetica', 'normal');
  doc.text(delivery.customerName.toUpperCase(), margin, infoYStart + 5);
  const addressText = doc.splitTextToSize(customer?.address || '', boxWidth - 5);
  doc.text(addressText, margin, infoYStart + 10);
  const addressHeight = doc.getTextDimensions(addressText).h;
  doc.text(`Telp: ${customer?.phone || ''}`, margin, infoYStart + 10 + addressHeight + 2);

  // Delivery Details Box
  const rightBoxX = pageWidth - margin - boxWidth;
  const labelX = rightBoxX;
  const valueX = labelX + 32;

  doc.setFont('helvetica', 'bold');
  doc.text('No. Surat Jalan', labelX, infoYStart);
  doc.text('Tanggal Kirim', labelX, infoYStart + 5);
  doc.text('No. Kendaraan', labelX, infoYStart + 10);
  doc.text('Ekspedisi', labelX, infoYStart + 15);

  doc.setFont('helvetica', 'normal');
  doc.text(`: ${delivery.deliveryNoteNumber}`, valueX, infoYStart);
  doc.text(`: ${new Date(delivery.deliveryDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`, valueX, infoYStart + 5);
  doc.text(`: ${delivery.vehicleNumber || '-'}`, valueX, infoYStart + 10);
  doc.text(`: ${delivery.expedition || '-'}`, valueX, infoYStart + 15);
  
  const infoSectionHeight = Math.max(40, addressHeight + 20);
  doc.setDrawColor(200, 200, 200);
  doc.roundedRect(margin - 5, infoYStart - 8, boxWidth + 10, infoSectionHeight, 3, 3, 'S');
  doc.roundedRect(rightBoxX - 5, infoYStart - 8, boxWidth + 10, infoSectionHeight, 3, 3, 'S');


  // 3. Table of Items
  const tableColumn = ["No.", "Nama Barang", "No. PO", "Ukuran", "Jumlah"];
  const tableRows: any[][] = [];

  delivery.items.forEach((item, index) => {
    const size = item.finishedSize 
      ? (item.type === 'Box' 
          ? `${item.finishedSize.length} x ${item.finishedSize.width} x ${item.finishedSize.height} cm`
          : `${item.finishedSize.length} x ${item.finishedSize.width} cm`)
      : '';

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
    startY: infoYStart + infoSectionHeight + 5, 
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        4: { halign: 'right' },
    }
  });
  
  let finalY = (doc as any).lastAutoTable.finalY || 150;
  finalY = Math.max(finalY, pageHeight - 80); // Ensure footer is not too high

  // Separator line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, finalY + 5, pageWidth - margin, finalY + 5);

  // 4. Footer & Signature
  const signatureY = finalY + 15;
  const signatureX = {
      sender: margin + 30,
      driver: pageWidth / 2,
      receiver: pageWidth - margin - 30
  }

  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text('Hormat Kami,', signatureX.sender, signatureY, { align: 'center' });
  doc.text('Pengirim,', signatureX.driver, signatureY, { align: 'center' });
  doc.text('Penerima,', signatureX.receiver, signatureY, { align: 'center' });

  const signatureLineY = signatureY + 20;
  doc.text('(_________________)', signatureX.sender, signatureLineY, { align: 'center' });
  doc.text(`(${delivery.driverName || '_________________'})`, signatureX.driver, signatureLineY, { align: 'center' });
  doc.text('(_________________)', signatureX.receiver, signatureLineY, { align: 'center' });

  // Absolute Footer Note
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const footerText = "Dokumen ini dibuat secara otomatis oleh sistem. Terima kasih atas kerja sama Anda.";
  doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });


  // Return the PDF as a data URI
  return doc.output('datauristring');
};
