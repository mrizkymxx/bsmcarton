

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
  const headerRectHeight = 40; // Increased height from 30 to 40
  doc.setFillColor(248, 249, 250); // Lighter gray background
  doc.rect(0, 0, pageWidth, headerRectHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16); // Slightly larger company name
  doc.setTextColor(40, 40, 40);
  doc.text('PT. BINTANG SUKSES MULIA', margin, 18); // Adjusted Y position
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Jl. Raya Jepara - Kudus Desa Krasak RT. 001 RW . 005', margin, 26); // Adjusted Y position
  doc.text('Kec. Pecangaan, Kab. Jepara - Jawa Tengah', margin, 31); // Adjusted Y position

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SURAT JALAN / 送货单', pageWidth - margin, 25, { align: 'right' }); // Adjusted Y position


  // 2. Delivery Info Section
  const infoYStart = headerRectHeight + 12;
  const boxWidth = (pageWidth - (margin * 3)) / 2;

  // Customer Info Box
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Kepada Yth: / 致:', margin, infoYStart);
  doc.setFont('helvetica', 'bold');
  doc.text(delivery.customerName.toUpperCase(), margin, infoYStart + 5);
  
  doc.setFont('helvetica', 'normal');
  const addressText = doc.splitTextToSize(customer?.address || '', boxWidth - 5);
  doc.text(addressText, margin, infoYStart + 10);
  const addressHeight = doc.getTextDimensions(addressText).h;
  doc.text(`Telp: ${customer?.phone || ''}`, margin, infoYStart + 10 + addressHeight + 2);

  // Delivery Details Box
  const rightBoxX = pageWidth - margin - boxWidth;
  const labelX = rightBoxX;
  const valueX = labelX + 38; // Increased width for Chinese characters

  doc.setFont('helvetica', 'bold');
  doc.text('No. Surat Jalan / 送货单号', labelX, infoYStart);
  doc.text('Tanggal Kirim / 发货日期', labelX, infoYStart + 5);
  doc.text('No. Kendaraan / 车牌号码', labelX, infoYStart + 10);
  doc.text('Ekspedisi / 运输', labelX, infoYStart + 15);

  doc.setFont('helvetica', 'normal');
  doc.text(`: ${delivery.deliveryNoteNumber}`, valueX, infoYStart);
  doc.text(`: ${new Date(delivery.deliveryDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`, valueX, infoYStart + 5);
  doc.text(`: ${delivery.vehicleNumber || '-'}`, valueX, infoYStart + 10);
  doc.text(`: ${delivery.expedition || '-'}`, valueX, infoYStart + 15);
  
  const infoSectionHeight = Math.max(40, addressHeight + 20);
  doc.setDrawColor(224, 224, 224); // Lighter border color
  doc.roundedRect(margin - 5, infoYStart - 8, boxWidth + 10, infoSectionHeight, 3, 3, 'S');
  doc.roundedRect(rightBoxX - 5, infoYStart - 8, boxWidth + 10, infoSectionHeight, 3, 3, 'S');


  // 3. Table of Items
  const tableColumn = ["No. / 序号", "Nama Barang / 货品名称", "No. PO / 订单号", "Ukuran / 规格", "Jumlah / 数量"];
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
    headStyles: { fillColor: [49, 46, 129], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        4: { halign: 'right' },
    }
  });
  
  let finalY = (doc as any).lastAutoTable.finalY || 150;

  // Watermark
  const watermarkText = 'PT. BINTANG SUKSES MULIA';
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(240, 240, 240); // Even lighter watermark
  doc.text(watermarkText, pageWidth / 2, pageHeight / 2, {
    angle: -10,
    align: 'center'
  });

  // Reset text color for footer
  doc.setTextColor(40, 40, 40);

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
  doc.setFont('helvetica', 'normal');
  doc.text('Hormat Kami, / 敬上,', signatureX.sender, signatureY, { align: 'center' });
  doc.text('Pengirim, / 发货人,', signatureX.driver, signatureY, { align: 'center' });
  doc.text('Penerima, / 收货人,', signatureX.receiver, signatureY, { align: 'center' });

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
