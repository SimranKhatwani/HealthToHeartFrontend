import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadPdf = ({ title = "Report", headers = [], data = [], fileName = "report.pdf" }) => {
  const doc = new jsPDF();

  doc.text(title, 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [headers],
    body: data,
  });

  doc.save(fileName);
};
