from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime
from io import BytesIO


class SACSPDFGenerator:
    """Generate SACS (Savings Account and Cash Strategy) PDF reports."""

    def __init__(self):
        self.width, self.height = letter
        self.margin = 0.5 * inch

    def generate_sacs_report(self, client_data: dict, report_data: dict) -> BytesIO:
        """
        Generate a SACS PDF report.
        
        Args:
            client_data: Client information
            report_data: Calculated report values
            
        Returns:
            BytesIO object containing PDF
        """
        pdf_buffer = BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=letter)
        
        # Header
        c.setFont("Helvetica-Bold", 16)
        c.drawString(self.margin, self.height - self.margin, "SACS Report")
        c.setFont("Helvetica", 10)
        c.drawString(self.margin, self.height - self.margin - 0.3 * inch, 
                    f"Client: {client_data.get('first_name', 'Unknown')}")
        c.drawString(self.margin, self.height - self.margin - 0.5 * inch, 
                    f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Draw horizontal line
        c.line(self.margin, self.height - self.margin - 0.6 * inch, 
              self.width - self.margin, self.height - self.margin - 0.6 * inch)
        
        # SACS Data
        y_position = self.height - self.margin - 1.0 * inch
        c.setFont("Helvetica-Bold", 12)
        c.drawString(self.margin, y_position, "Private Reserve Analysis")
        
        y_position -= 0.3 * inch
        c.setFont("Helvetica", 11)
        
        inflow = report_data.get('inflow', 0)
        outflow = report_data.get('outflow', 0)
        excess = report_data.get('excess', 0)
        
        c.drawString(self.margin, y_position, f"Monthly Inflow: ${inflow:,.2f}")
        y_position -= 0.25 * inch
        c.drawString(self.margin, y_position, f"Monthly Outflow: ${outflow:,.2f}")
        y_position -= 0.25 * inch
        c.drawString(self.margin, y_position, f"Private Reserve Excess: ${excess:,.2f}")
        
        c.save()
        pdf_buffer.seek(0)
        return pdf_buffer


class TCCPDFGenerator:
    """Generate TCC (Total Client Composition) PDF reports."""

    def __init__(self):
        self.width, self.height = letter
        self.margin = 0.5 * inch

    def generate_tcc_report(self, client_data: dict, report_data: dict) -> BytesIO:
        """
        Generate a TCC PDF report.
        
        Args:
            client_data: Client information
            report_data: Calculated totals by category
            
        Returns:
            BytesIO object containing PDF
        """
        pdf_buffer = BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=letter)
        
        # Header
        c.setFont("Helvetica-Bold", 16)
        c.drawString(self.margin, self.height - self.margin, "TCC Report")
        c.setFont("Helvetica", 10)
        c.drawString(self.margin, self.height - self.margin - 0.3 * inch, 
                    f"Client: {client_data.get('first_name', 'Unknown')}")
        c.drawString(self.margin, self.height - self.margin - 0.5 * inch, 
                    f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Draw horizontal line
        c.line(self.margin, self.height - self.margin - 0.6 * inch, 
              self.width - self.margin, self.height - self.margin - 0.6 * inch)
        
        # TCC Data
        y_position = self.height - self.margin - 1.0 * inch
        c.setFont("Helvetica-Bold", 12)
        c.drawString(self.margin, y_position, "Asset & Liability Breakdown")
        
        y_position -= 0.3 * inch
        c.setFont("Helvetica", 11)
        
        data = [
            ("Category", "Amount"),
            ("Retirement Accounts", f"${report_data.get('retirement_total', 0):,.2f}"),
            ("Non-Retirement Accounts", f"${report_data.get('non_retirement_total', 0):,.2f}"),
            ("Trust/Real Estate", f"${report_data.get('trust_total', 0):,.2f}"),
            ("Total Assets", f"${report_data.get('total_assets', 0):,.2f}"),
            ("Total Liabilities", f"${report_data.get('liabilities_total', 0):,.2f}"),
            ("Net Worth", f"${report_data.get('net_worth', 0):,.2f}"),
        ]
        
        table = Table(data, colWidths=[3.5*inch, 2.5*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        # Draw table at position
        table.wrapOn(c, self.width - 2*self.margin, self.height)
        table.drawOn(c, self.margin, y_position - 2*inch)
        
        c.save()
        pdf_buffer.seek(0)
        return pdf_buffer
