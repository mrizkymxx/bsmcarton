
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
  const today = new Date();

  // 1. Header
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PT. BINTANG SUKSES MULIA', 15, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Jl. Raya Jepara - Kudus Desa Krasak RT. 001 RW . 005', 15, 26);
  doc.text('Kec. Pecangaan, Kab. Jepara - Jawa Tengah', 15, 31);
  doc.text('Phone : 082 352 181 830', 15, 36);
  doc.text(`Jepara, ${today.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth - 15, 31, { align: 'right' });
  doc.text('E-mail : bintangsuksesmulia@hotmail.com', 15, 41);
  
  // Add a line separator
  doc.setLineWidth(0.5);
  doc.line(15, 45, pageWidth - 15, 45);


  // 2. Delivery Info
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SURAT JALAN', pageWidth / 2, 55, { align: 'center' });
  
  const infoY = 65;
  doc.setFontSize(10);
  
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
    startY: infoY + 25,
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74] },
    columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        4: { halign: 'right' },
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


  // Return the PDF as a data URI
  return doc.output('datauristring');
};
