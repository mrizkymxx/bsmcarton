
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

export const generateDeliveryNotePDF = (delivery: Delivery, customer: Customer) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SURAT JALAN', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('PT. BSMcarton', pageWidth / 2, 27, { align: 'center' });


  // 2. Delivery Info
  doc.setFontSize(10);
  const infoY = 40;
  
  // Left column
  doc.setFont('helvetica', 'bold');
  doc.text('Kepada Yth:', 15, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(delivery.customerName, 15, infoY + 5);
  doc.text(customer?.address || 'Alamat tidak ditemukan', 15, infoY + 10, { maxWidth: 80 });
  
  // Right column
  doc.setFont('helvetica', 'bold');
  doc.text('No. Surat Jalan:', pageWidth - 70, infoY);
  doc.setFont('helvetica', 'normal');
  doc.text(delivery.deliveryNoteNumber, pageWidth - 15, infoY, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.text('Tanggal Kirim:', pageWidth - 70, infoY + 5);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date(delivery.deliveryDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }), pageWidth - 15, infoY + 5, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.text('No. Kendaraan:', pageWidth - 70, infoY + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(delivery.vehicleNumber || '-', pageWidth - 15, infoY + 10, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.text('No. PO:', pageWidth - 70, infoY + 15);
  doc.setFont('helvetica', 'normal');
  // Combine unique PO numbers
  const poNumbers = [...new Set(delivery.items.map(item => item.poNumber))].join(', ');
  doc.text(poNumbers, pageWidth - 15, infoY + 15, { align: 'right' });


  // 3. Table of Items
  const tableColumn = ["No.", "Nama Barang", "Ukuran", "Jumlah"];
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
      size,
      `${item.quantity.toLocaleString()} pcs`,
    ];
    tableRows.push(itemData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: infoY + 25,
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74] },
    columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        3: { halign: 'right' },
    }
  });
  
  let finalY = (doc as any).lastAutoTable.finalY || 100;

  // 4. Footer & Signature
  const signatureY = finalY + 20;
  const signatureX = {
      sender: 30,
      driver: pageWidth / 2,
      receiver: pageWidth - 30
  }

  doc.setFontSize(10);
  doc.text('Hormat Kami,', signatureX.sender, signatureY, { align: 'center' });
  doc.text('Pengirim,', signatureX.driver, signatureY, { align: 'center' });
  doc.text('Penerima,', signatureX.receiver, signatureY, { align: 'center' });

  doc.text('(_________________)', signatureX.sender, signatureY + 20, { align: 'center' });
  doc.text(`(${delivery.driverName || '_________________'})`, signatureX.driver, signatureY + 20, { align: 'center' });
  doc.text('(_________________)', signatureX.receiver, signatureY + 20, { align: 'center' });


  // Save the PDF
  doc.save(`surat-jalan-${delivery.deliveryNoteNumber}.pdf`);
};
