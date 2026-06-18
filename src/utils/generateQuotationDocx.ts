import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  Packer,
} from "docx";
import { saveAs } from "file-saver";

const PURPLE = "7C3AED";
const VIOLET = "8B5CF6";
const GREEN = "059669";
const GRAY = "6B7280";
const LIGHT_BG = "F3F4F6";

const cellBorders = {
  top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
  left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
  right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
} as const;

const headerShading = { type: ShadingType.SOLID, color: LIGHT_BG, fill: LIGHT_BG } as const;

function heading(num: string, title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text: `${num}. ${title}`, bold: true, size: 28, font: "Calibri" })],
  });
}

function moduleHeading(num: string, title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 300, after: 100 },
    children: [new TextRun({ text: `${num} — ${title}`, bold: true, size: 22, font: "Calibri" })],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 20, font: "Calibri", color: "374151" })],
  });
}

function bodyText(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, size: 20, font: "Calibri", color: "374151" })],
  });
}

function labelValue(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 20, font: "Calibri" }),
      new TextRun({ text: value, size: 20, font: "Calibri", color: GRAY }),
    ],
  });
}

function makeTable(headers: string[], rows: string[][], colWidths?: number[]): Table {
  const widths = colWidths || headers.map(() => Math.floor(9000 / headers.length));
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: [
      new TableRow({
        children: headers.map((h, i) => new TableCell({
          width: { size: widths[i], type: WidthType.DXA },
          borders: cellBorders,
          shading: headerShading,
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, font: "Calibri" })] })],
        })),
      }),
      ...rows.map((row, ri) =>
        new TableRow({
          children: row.map((cell, ci) => new TableCell({
            width: { size: widths[ci], type: WidthType.DXA },
            borders: cellBorders,
            shading: ri % 2 === 1 ? { type: ShadingType.SOLID, color: "F9FAFB", fill: "F9FAFB" } : undefined,
            children: [new Paragraph({
              alignment: ci === row.length - 1 && headers[ci]?.includes("Amount") ? AlignmentType.RIGHT : AlignmentType.LEFT,
              children: [new TextRun({ text: cell, size: 20, font: "Calibri", color: "374151" })],
            })],
          })),
        })
      ),
    ],
  });
}

function ganttBar(): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: "Delivery Schedule (75 Days)", bold: true, size: 20, font: "Calibri" })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "██████████████████████████████ ", color: PURPLE, size: 20, font: "Calibri" }),
        new TextRun({ text: "Development (45 days)  ", size: 20, font: "Calibri" }),
      ],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [
        new TextRun({ text: "██████████ ", color: VIOLET, size: 20, font: "Calibri" }),
        new TextRun({ text: "UAT & Testing (15 days)  ", size: 20, font: "Calibri" }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({ text: "██████████ ", color: GREEN, size: 20, font: "Calibri" }),
        new TextRun({ text: "Go-Live Support (15 days)", size: 20, font: "Calibri" }),
      ],
    }),
  ];
}

function signatureBlock(label: string): Paragraph[] {
  return [
    new Paragraph({ spacing: { before: 300 }, children: [new TextRun({ text: label, bold: true, size: 20, font: "Calibri" })] }),
    new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "________________________", size: 20, font: "Calibri", color: GRAY })] }),
    new Paragraph({ children: [new TextRun({ text: "Name", size: 16, font: "Calibri", color: GRAY })] }),
    new Paragraph({ spacing: { before: 150 }, children: [new TextRun({ text: "________________________", size: 20, font: "Calibri", color: GRAY })] }),
    new Paragraph({ children: [new TextRun({ text: "Title / Designation", size: 16, font: "Calibri", color: GRAY })] }),
    new Paragraph({ spacing: { before: 150 }, children: [new TextRun({ text: "________________________", size: 20, font: "Calibri", color: GRAY })] }),
    new Paragraph({ children: [new TextRun({ text: "Date", size: 16, font: "Calibri", color: GRAY })] }),
    new Paragraph({ spacing: { before: 150 }, children: [new TextRun({ text: "________________________", size: 20, font: "Calibri", color: GRAY })] }),
    new Paragraph({ children: [new TextRun({ text: "Signature & Stamp", size: 16, font: "Calibri", color: GRAY })] }),
  ];
}

export async function generateQuotationDocx() {
  const doc = new Document({
    sections: [{
      properties: {
        page: { margin: { top: 1000, right: 1200, bottom: 1000, left: 1200 } },
      },
      children: [
        // Header
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Project Quotation / Technical Proposal", bold: true, size: 36, font: "Calibri" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          children: [new TextRun({ text: "RUW FitnessPro — Gym Management System", bold: true, size: 24, font: "Calibri", color: PURPLE })],
        }),

        labelValue("Reference", "RUW-FP-2026-001"),
        labelValue("Date", "February 16, 2026"),
        labelValue("Valid Until", "May 16, 2026"),
        labelValue("Prepared For", "Integrated Bell Systems Middle East W.L.L"),

        // 1. Executive Summary
        heading("1", "Executive Summary"),
        bodyText("RUW FitnessPro is a comprehensive, web-based Gym Management System designed exclusively for the Royal University for Women. The system provides end-to-end fitness center management capabilities, covering member enrollment, trainer coordination, workout planning, payment processing, real-time gym floor monitoring, and multi-channel notification management. The solution is engineered to streamline administrative operations while delivering a modern, intuitive experience for gym administrators."),

        // 2. Scope of Work
        heading("2", "Scope of Work — Feature Modules"),

        moduleHeading("2.1", "Authentication & Access Control"),
        bullet("Admin-only access with role-based permissions"),
        bullet("Secure sign-in with email and password credentials"),
        bullet("Session management with automatic timeout"),

        moduleHeading("2.2", "Admin Dashboard"),
        bullet("Overview statistics: Total Members, Active Members, Monthly Revenue, Daily Attendance"),
        bullet("Quick-action navigation to all management modules"),
        bullet("Real-time Gym Floor Activity monitoring panel"),
        bullet("  • Members currently in gym (name, CPR, check-in time)"),
        bullet("  • Recent arrivals feed"),
        bullet("  • Recent departures with stay duration"),
        bullet("  • Live attendance stats (current count, today's visits, average duration)"),

        moduleHeading("2.3", "Member Management"),
        bullet("Complete member registration (CPR, full name, DOB, gender, contact details)"),
        bullet("Emergency contact information capture"),
        bullet("Membership type assignment (Premium, Standard, Basic)"),
        bullet("Active / Inactive status management"),
        bullet("Promotional and notification opt-in preferences"),
        bullet("Advanced member search and filtering"),
        bullet("View, edit, and delete member records"),

        moduleHeading("2.4", "Faculty / Trainer Management"),
        bullet("Trainer registration with certifications and specializations"),
        bullet("Experience tracking and schedule configuration"),
        bullet("Trainer assignment to workout programs"),
        bullet("Working hours and availability configuration"),
        bullet("Trainer profiles with member ratings and reviews"),

        moduleHeading("2.5", "Workout Program Management"),
        bullet("Program creation with exercises, sets, and reps"),
        bullet("Category and difficulty level assignment"),
        bullet("Session duration and frequency configuration"),
        bullet("Faculty / trainer assignment per program"),
        bullet("Tiered membership packages: Monthly (30 days), Quarterly (90 days), Half-Yearly (180 days)"),
        bullet("Package pricing with configurable discount percentages"),
        bullet("Program activation and deactivation controls"),

        moduleHeading("2.6", "Payment Management"),
        bullet("Multiple payment methods: Cash, Online, BenefitPay (subject to API availability)"),
        bullet("Payment recording with automated receipt generation"),
        bullet("Coupon and discount code application at checkout"),
        bullet("Payment status tracking (Completed, Pending, Failed)"),
        bullet("Revenue analytics with interactive charts (Line, Pie, Bar)"),
        bullet("External system posting integration capability"),
        bullet("Payment history search and reporting"),

        moduleHeading("2.7", "Coupon Management"),
        bullet("Coupon code generation (percentage-based or fixed amount)"),
        bullet("Validity period configuration (start and end dates)"),
        bullet("Maximum usage limit settings"),
        bullet("Minimum purchase requirement rules"),
        bullet("Applicable package restrictions"),
        bullet("Coupon status management (Active, Inactive, Expired)"),

        moduleHeading("2.8", "Notification Management"),
        bodyText("Channel Configurations:"),
        bullet("Email SMTP Configuration: Host, port, credentials, SSL/TLS, test connection"),
        bullet("SMS API Configuration: Provider selection (Twilio, MSG91, Unifonic), API credentials, sender ID"),
        bullet("WhatsApp API Configuration: Business API credentials, phone number ID, webhook URL"),
        bodyText("Notification Features:"),
        bullet("Bulk notification sending across Email, SMS, and WhatsApp channels"),
        bullet("Target audience selection (All, Active, Inactive, Promotional opt-in, Expiring soon)"),
        bullet("Notification template management with dynamic placeholders"),
        bullet("Delivery tracking and history with sent/failed counts"),
        bullet("Scheduled sending capability"),

        moduleHeading("2.9", "Real-Time Gym Floor Monitoring"),
        bullet("Live member check-in / check-out tracking"),
        bullet("Currently-in-gym display with CPR and timestamps"),
        bullet("Recent arrivals and departures feeds"),
        bullet("Today's attendance statistics dashboard"),
        bullet("Auto-refresh capability (30-second intervals)"),

        // 3. Deployment Environment
        heading("3", "Deployment Environment"),
        makeTable(
          ["Component", "Specification"],
          [
            ["Web Server", "Microsoft IIS (Internet Information Services) on Windows Server"],
            ["Database Server", "Microsoft SQL Server — Standard Edition"],
            ["Operating System", "Microsoft Windows Server 2019 / 2022"],
            ["Application Runtime", ".NET / Node.js hosted on IIS"],
            ["Browser Support", "Chrome, Firefox, Edge, Safari (latest versions)"],
            ["Responsive Design", "Desktop, Tablet, and Mobile compatible"],
          ],
          [3000, 6000]
        ),

        // 4. Project Timeline
        heading("4", "Project Timeline"),
        bodyText("The project will be delivered in three main phases over a total of 75 working days, followed by one year of ongoing support and maintenance."),
        ...ganttBar(),
        makeTable(
          ["Phase", "Duration", "Timeline", "Key Deliverables"],
          [
            ["Development & Implementation", "45 days", "Day 1 – Day 45", "Core modules, integrations, deployment setup"],
            ["UAT & Testing", "15 days", "Day 46 – Day 60", "User acceptance testing, bug fixes, feedback incorporation"],
            ["Go-Live Support", "15 days", "Day 61 – Day 75", "Production deployment, monitoring, issue resolution"],
            ["Post Go-Live Support & Maintenance", "1 Year", "Day 76 onwards", "Ongoing maintenance, bug fixes, minor enhancements"],
          ],
          [2500, 1500, 2000, 3000]
        ),

        // 5. Commercial Proposal
        heading("5", "Commercial Proposal"),
        new Table({
          width: { size: 9000, type: WidthType.DXA },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 6500, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: headerShading,
                  children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, size: 20, font: "Calibri" })] })],
                }),
                new TableCell({
                  width: { size: 2500, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: headerShading,
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Amount (BHD)", bold: true, size: 20, font: "Calibri" })] })],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 6500, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { type: ShadingType.SOLID, color: LIGHT_BG, fill: LIGHT_BG },
                  children: [new Paragraph({ children: [new TextRun({ text: "RUW FitnessPro — Gym Management System (Development, UAT, Go-Live & 1 Year Support)", bold: true, size: 20, font: "Calibri" })] })],
                }),
                new TableCell({
                  width: { size: 2500, type: WidthType.DXA },
                  borders: cellBorders,
                  shading: { type: ShadingType.SOLID, color: LIGHT_BG, fill: LIGHT_BG },
                  children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "2,000 BHD", bold: true, size: 20, font: "Calibri" })] })],
                }),
              ],
            }),
          ],
        }),
        bodyText("All amounts are in Bahraini Dinar (BHD) and exclusive of any applicable taxes."),

        // 6. Terms & Conditions
        heading("6", "Terms & Conditions"),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "6.1 Warranty", bold: true, size: 20, font: "Calibri" })] }),
        bodyText("A warranty period of six (6) months shall commence from the date of final delivery and acceptance. During this period, the developer shall rectify any defects or bugs at no additional cost."),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "6.2 Support & Maintenance", bold: true, size: 20, font: "Calibri" })] }),
        bodyText("Post-warranty technical support and maintenance services shall be available under a separate annual maintenance contract (AMC), to be agreed upon by both parties."),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "6.3 Change Requests", bold: true, size: 20, font: "Calibri" })] }),
        bodyText("Any modifications or additions beyond the scope defined in this document shall be treated as change requests and will be estimated, quoted, and approved separately before implementation."),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "6.4 Confidentiality", bold: true, size: 20, font: "Calibri" })] }),
        bodyText("Both parties agree to maintain strict confidentiality of all project-related information, data, and documentation shared during the course of this engagement."),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "6.5 Payment Terms", bold: true, size: 20, font: "Calibri" })] }),
        bodyText("Payment schedule shall be mutually agreed upon and documented in a formal purchase order or contract prior to project commencement."),

        // 7. Signatures
        heading("7", "Authorization & Signatures"),
        bodyText("This quotation is hereby submitted for your review and approval. Upon acceptance, both parties agree to the terms and scope outlined in this document."),
        ...signatureBlock("For YJK Technologies Private Limited"),
        ...signatureBlock("For Integrated Bell Systems Middle East W.L.L"),

        // Footer
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [new TextRun({ text: "RUW FitnessPro — Confidential Document", size: 16, font: "Calibri", color: GRAY })],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "RUW-FitnessPro-Quotation.docx");
}
