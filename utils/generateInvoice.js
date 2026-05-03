import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  // Header
  doc.setFont('playfair', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(74, 55, 40); // text-brown
  doc.text('BAKERY & CO.', 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(125, 110, 99); // text-muted
  doc.text('Artisanal Breads & Pastries', 105, 26, { align: 'center' });
  doc.text('Dhaka, Bangladesh | +880 1234 567890', 105, 31, { align: 'center' });

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('INVOICE', 20, 50);

  // Details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice No: ${order.trackingId}`, 20, 60);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 65);
  doc.text(`Customer: ${order.userId.name}`, 20, 70);
  doc.text(`Payment: ${order.paymentMethod} (${order.paymentStatus})`, 20, 75);

  // Items
  const tableColumn = ["Product", "Price", "Qty", "Total"];
  const tableRows = [];

  order.products.forEach(item => {
    const productData = [
      item.name,
      `TK ${item.price}`,
      item.quantity,
      `TK ${(item.price * item.quantity).toFixed(2)}`
    ];
    tableRows.push(productData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 85,
    theme: 'striped',
    headStyles: { fillColor: [138, 154, 91] }, // sage
    styles: { font: 'helvetica' }
  });

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Subtotal: TK ${order.totalPrice.toFixed(2)}`, 150, finalY);
  if (order.discount > 0) {
    doc.text(`Discount: -TK ${order.discount.toFixed(2)}`, 150, finalY + 5);
  }
  doc.text(`Shipping: TK 60.00`, 150, finalY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Final Total: TK ${order.finalPrice.toFixed(2)}`, 150, finalY + 18);

  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', '');
  doc.text('Thank you for choosing our fresh delights!', 105, finalY + 40, { align: 'center' });

  doc.save(`Invoice_${order.trackingId}.pdf`);
};
