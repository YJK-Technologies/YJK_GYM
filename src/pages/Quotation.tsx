
import ruwLogo from "@/assets/ruw-logo-full.png";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer, FileDown } from "lucide-react";
import { generateQuotationDocx } from "@/utils/generateQuotationDocx";

const Quotation = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-muted print:bg-white">
      {/* Print Button - hidden in print */}
      <div className="fixed top-6 right-6 z-50 print:hidden flex gap-2">
        <Button onClick={generateQuotationDocx} size="lg" variant="outline" className="shadow-lg gap-2">
          <FileDown className="h-5 w-5" />
          Download Word
        </Button>
        <Button onClick={handlePrint} size="lg" className="shadow-lg gap-2">
          <Printer className="h-5 w-5" />
          Print / Save PDF
        </Button>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-8 print:py-0 print:px-0">
        <div className="bg-card shadow-lg print:shadow-none rounded-lg p-12 print:p-8 space-y-8">

          {/* Header */}
          <div className="text-center space-y-4">
            <img src={ruwLogo} alt="RUW FitnessPro" className="h-20 mx-auto" />
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Project Quotation / Technical Proposal
            </h1>
            <p className="text-lg font-semibold text-primary">RUW FitnessPro — Gym Management System</p>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground max-w-md mx-auto">
              <div className="text-left"><strong>Reference:</strong></div>
              <div className="text-right">RUW-FP-2026-001</div>
              <div className="text-left"><strong>Date:</strong></div>
              <div className="text-right">February 16, 2026</div>
              <div className="text-left"><strong>Valid Until:</strong></div>
              <div className="text-right">May 16, 2026</div>
              <div className="text-left"><strong>Prepared For:</strong></div>
              <div className="text-right">Integrated Bell Systems Middle East W.L.L</div>
            </div>
          </div>

          <Separator />

          {/* 1. Executive Summary */}
          <Section number="1" title="Executive Summary">
            <p>
              RUW FitnessPro is a comprehensive, web-based Gym Management System designed exclusively for the Royal University for Women. 
              The system provides end-to-end fitness center management capabilities, covering member enrollment, trainer coordination, 
              workout planning, payment processing, real-time gym floor monitoring, and multi-channel notification management. 
              The solution is engineered to streamline administrative operations while delivering a modern, intuitive experience for gym administrators.
            </p>
          </Section>

          {/* 2. Scope of Work */}
          <Section number="2" title="Scope of Work — Feature Modules">

            <Module number="2.1" title="Authentication & Access Control">
              <FeatureList items={[
                "Admin-only access with role-based permissions",
                "Secure sign-in with email and password credentials",
                "Session management with automatic timeout",
              ]} />
            </Module>

            <Module number="2.2" title="Admin Dashboard">
              <FeatureList items={[
                "Overview statistics: Total Members, Active Members, Monthly Revenue, Daily Attendance",
                "Quick-action navigation to all management modules",
                "Real-time Gym Floor Activity monitoring panel:",
              ]} />
              <ul className="ml-8 list-[circle] text-sm space-y-1 text-muted-foreground">
                <li>Members currently in gym (name, CPR, check-in time)</li>
                <li>Recent arrivals feed</li>
                <li>Recent departures with stay duration</li>
                <li>Live attendance stats (current count, today's visits, average duration)</li>
              </ul>
            </Module>

            <Module number="2.3" title="Member Management">
              <FeatureList items={[
                "Complete member registration (CPR, full name, DOB, gender, contact details)",
                "Emergency contact information capture",
                "Membership type assignment (Premium, Standard, Basic)",
                "Active / Inactive status management",
                "Promotional and notification opt-in preferences",
                "Advanced member search and filtering",
                "View, edit, and delete member records",
              ]} />
            </Module>

            <Module number="2.4" title="Faculty / Trainer Management">
              <FeatureList items={[
                "Trainer registration with certifications and specializations",
                "Experience tracking and schedule configuration",
                "Trainer assignment to workout programs",
                "Working hours and availability configuration",
                "Trainer profiles with member ratings and reviews",
              ]} />
            </Module>

            <Module number="2.5" title="Workout Program Management">
              <FeatureList items={[
                "Program creation with exercises, sets, and reps",
                "Category and difficulty level assignment",
                "Session duration and frequency configuration",
                "Faculty / trainer assignment per program",
                "Tiered membership packages: Monthly (30 days), Quarterly (90 days), Half-Yearly (180 days)",
                "Package pricing with configurable discount percentages",
                "Program activation and deactivation controls",
              ]} />
            </Module>

            <Module number="2.6" title="Payment Management">
              <FeatureList items={[
                "Multiple payment methods: Cash, Online, BenefitPay (subject to API availability)",
                "Payment recording with automated receipt generation",
                "Coupon and discount code application at checkout",
                "Payment status tracking (Completed, Pending, Failed)",
                "Revenue analytics with interactive charts (Line, Pie, Bar)",
                "External system posting integration capability",
                "Payment history search and reporting",
              ]} />
            </Module>

            <Module number="2.7" title="Coupon Management">
              <FeatureList items={[
                "Coupon code generation (percentage-based or fixed amount)",
                "Validity period configuration (start and end dates)",
                "Maximum usage limit settings",
                "Minimum purchase requirement rules",
                "Applicable package restrictions",
                "Coupon status management (Active, Inactive, Expired)",
              ]} />
            </Module>

            <Module number="2.8" title="Notification Management">
              <p className="text-sm font-medium text-foreground mb-2">Channel Configurations:</p>
              <FeatureList items={[
                "Email SMTP Configuration: Host, port, credentials, SSL/TLS, test connection",
                "SMS API Configuration: Provider selection (Twilio, MSG91, Unifonic), API credentials, sender ID",
                "WhatsApp API Configuration: Business API credentials, phone number ID, webhook URL",
              ]} />
              <p className="text-sm font-medium text-foreground mt-3 mb-2">Notification Features:</p>
              <FeatureList items={[
                "Bulk notification sending across Email, SMS, and WhatsApp channels",
                "Target audience selection (All, Active, Inactive, Promotional opt-in, Expiring soon)",
                "Notification template management with dynamic placeholders",
                "Delivery tracking and history with sent/failed counts",
                "Scheduled sending capability",
              ]} />
            </Module>

            <Module number="2.9" title="Real-Time Gym Floor Monitoring">
              <FeatureList items={[
                "Live member check-in / check-out tracking",
                "Currently-in-gym display with CPR and timestamps",
                "Recent arrivals and departures feeds",
                "Today's attendance statistics dashboard",
                "Auto-refresh capability (30-second intervals)",
              ]} />
            </Module>
          </Section>

          {/* 3. Deployment Environment */}
          <Section number="3" title="Deployment Environment">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-md">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 border-b border-border font-semibold">Component</th>
                    <th className="text-left p-3 border-b border-border font-semibold">Specification</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Web Server", "Microsoft IIS (Internet Information Services) on Windows Server"],
                    ["Database Server", "Microsoft SQL Server — Standard Edition"],
                    ["Operating System", "Microsoft Windows Server 2019 / 2022"],
                    ["Application Runtime", ".NET / Node.js hosted on IIS"],
                    ["Browser Support", "Chrome, Firefox, Edge, Safari (latest versions)"],
                    ["Responsive Design", "Desktop, Tablet, and Mobile compatible"],
                  ].map(([comp, spec], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="p-3 border-b border-border font-medium">{comp}</td>
                      <td className="p-3 border-b border-border text-muted-foreground">{spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 4. Project Timeline */}
          <Section number="4" title="Project Timeline">
            <p className="mb-4">
              The project will be delivered in three main phases over a total of 75 working days, followed by one year of ongoing support and maintenance.
            </p>

            {/* Gantt Chart */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-foreground mb-2">Delivery Schedule (75 Days)</p>
              <div className="flex w-full h-10 rounded-md overflow-hidden text-xs font-medium text-white">
                <div className="bg-purple-600 flex items-center justify-center" style={{ width: '60%' }}>
                  Development (45 days)
                </div>
                <div className="bg-violet-500 flex items-center justify-center" style={{ width: '20%' }}>
                  UAT (15 days)
                </div>
                <div className="bg-emerald-600 flex items-center justify-center" style={{ width: '20%' }}>
                  Go-Live (15 days)
                </div>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-600 inline-block" /> Development</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-violet-500 inline-block" /> UAT & Testing</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Go-Live Support</span>
              </div>
            </div>

            {/* Milestone Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-md">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 border-b border-border font-semibold">Phase</th>
                    <th className="text-left p-3 border-b border-border font-semibold">Duration</th>
                    <th className="text-left p-3 border-b border-border font-semibold">Timeline</th>
                    <th className="text-left p-3 border-b border-border font-semibold">Key Deliverables</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Development & Implementation", "45 days", "Day 1 – Day 45", "Core modules, integrations, deployment setup"],
                    ["UAT & Testing", "15 days", "Day 46 – Day 60", "User acceptance testing, bug fixes, feedback incorporation"],
                    ["Go-Live Support", "15 days", "Day 61 – Day 75", "Production deployment, monitoring, issue resolution"],
                    ["Post Go-Live Support & Maintenance", "1 Year", "Day 76 onwards", "Ongoing maintenance, bug fixes, minor enhancements"],
                  ].map(([phase, duration, timeline, deliverables], i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                      <td className="p-3 border-b border-border font-medium">{phase}</td>
                      <td className="p-3 border-b border-border text-muted-foreground">{duration}</td>
                      <td className="p-3 border-b border-border text-muted-foreground">{timeline}</td>
                      <td className="p-3 border-b border-border text-muted-foreground">{deliverables}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* 5. Commercial Proposal */}
          <Section number="5" title="Commercial Proposal">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-md">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 border-b border-border font-semibold">Description</th>
                    <th className="text-right p-3 border-b border-border font-semibold">Amount {/*(BHD)*/}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-muted font-bold">
                    <td className="p-3 border-b border-border text-foreground">RUW FitnessPro — Gym Management System (Development, UAT, Go-Live & 1 Year Support)</td>
                    <td className="p-3 border-b border-border text-right text-foreground">2,000 {/*BHD*/}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              All amounts are in Bahraini Dinar {/*(BHD)*/} and exclusive of any applicable taxes.
            </p>
          </Section>

          {/* 6. Terms and Conditions */}
          <Section number="6" title="Terms & Conditions">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">6.1 Warranty</p>
                <p>A warranty period of six (6) months shall commence from the date of final delivery and acceptance. During this period, the developer shall rectify any defects or bugs at no additional cost.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">6.2 Support & Maintenance</p>
                <p>Post-warranty technical support and maintenance services shall be available under a separate annual maintenance contract (AMC), to be agreed upon by both parties.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">6.3 Change Requests</p>
                <p>Any modifications or additions beyond the scope defined in this document shall be treated as change requests and will be estimated, quoted, and approved separately before implementation.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">6.4 Confidentiality</p>
                <p>Both parties agree to maintain strict confidentiality of all project-related information, data, and documentation shared during the course of this engagement.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">6.5 Payment Terms</p>
                <p>Payment schedule shall be mutually agreed upon and documented in a formal purchase order or contract prior to project commencement.</p>
              </div>
            </div>
          </Section>

          {/* 7. Signature Block */}
          <Section number="7" title="Authorization & Signatures">
            <p className="text-sm text-muted-foreground mb-8">
              This quotation is hereby submitted for your review and approval. Upon acceptance, both parties agree to the terms and scope outlined in this document.
            </p>
            <div className="grid grid-cols-2 gap-12">
              <SignatureBlock label="For YJK Technologies Private Limited" />
              <SignatureBlock label="For Integrated Bell Systems Middle East W.L.L" />
            </div>
          </Section>

          {/* Footer */}
          <Separator />
          <p className="text-center text-xs text-muted-foreground">
            RUW FitnessPro — Confidential Document — Page 1 of 1
          </p>
        </div>
      </div>
    </div>
  );
};

const Section = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="space-y-3 break-inside-avoid">
    <h2 className="text-xl font-bold text-foreground">
      {number}. {title}
    </h2>
    <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
  </div>
);

const Module = ({ number, title, children }: { number: string; title: string; children: React.ReactNode }) => (
  <div className="mt-4 mb-3 break-inside-avoid">
    <h3 className="text-base font-semibold text-foreground mb-2">
      {number} — {title}
    </h3>
    {children}
  </div>
);

const FeatureList = ({ items }: { items: string[] }) => (
  <ul className="list-disc ml-6 space-y-1 text-sm text-muted-foreground">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const SignatureBlock = ({ label }: { label: string }) => (
  <div className="space-y-6">
    <p className="font-semibold text-sm text-foreground">{label}</p>
    <div className="space-y-4">
      <div>
        <div className="border-b border-foreground/30 w-full mb-1" />
        <p className="text-xs text-muted-foreground">Name</p>
      </div>
      <div>
        <div className="border-b border-foreground/30 w-full mb-1" />
        <p className="text-xs text-muted-foreground">Title / Designation</p>
      </div>
      <div>
        <div className="border-b border-foreground/30 w-full mb-1" />
        <p className="text-xs text-muted-foreground">Date</p>
      </div>
      <div>
        <div className="border-b border-foreground/30 w-full mb-1" />
        <p className="text-xs text-muted-foreground">Signature & Stamp</p>
      </div>
    </div>
  </div>
);

export default Quotation;
