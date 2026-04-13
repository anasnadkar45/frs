import { jsPDF } from "jspdf";
import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("id");

  if (!planId) {
    return new Response("Plan ID is required", { status: 400 });
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const plan = await prisma.fitnessPlan.findUnique({
    where: {
      id: planId,
      userId: session.user.id,
    },
  });

  if (!plan) {
    return new Response("Plan not found", { status: 404 });
  }

  // Create PDF with better layout management
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 18;
  const marginRight = 18;
  const marginTop = 15;
  const marginBottom = 15;
  const maxWidth = pageWidth - marginLeft - marginRight;
  
  let yPosition = marginTop;

  // Helper function to add a new page if needed
  const checkPageBreak = (height: number) => {
    if (yPosition + height > pageHeight - marginBottom) {
      doc.addPage();
      yPosition = marginTop;
    }
  };

  // Helper function to add a section
  const addSection = (title: string, spacing: number = 12) => {
    checkPageBreak(spacing + 4);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(25, 25, 112); // Dark blue
    doc.text(title, marginLeft, yPosition);
    
    // Add underline
    doc.setDrawColor(100, 150, 200);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, yPosition + 1, pageWidth - marginRight, yPosition + 1);
    
    yPosition += spacing;
    doc.setTextColor(0, 0, 0); // Reset to black
  };

  // Header Section
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(25, 25, 112);
  doc.text("FITNESS PLAN", marginLeft, yPosition);
  yPosition += 12;

  // Plan summary
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  const summaryLines = doc.splitTextToSize(plan.summary, maxWidth);
  doc.text(summaryLines, marginLeft, yPosition);
  yPosition += summaryLines.length * 6 + 8;

  doc.setTextColor(0, 0, 0);

  // Key Metrics Section
  addSection("KEY METRICS", 11);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const metrics = [
    { label: "Category", value: plan.category },
    { label: "BMI", value: plan.bmi.toFixed(1) },
    { label: "Daily Calories", value: plan.calories.toString() },
    ...(plan.budget ? [{ label: "Budget", value: `₹${plan.budget}` }] : []),
    ...(plan.estimatedCost ? [{ label: "Estimated Cost", value: `₹${plan.estimatedCost}` }] : []),
  ];

  metrics.forEach((metric) => {
    checkPageBreak(5);
    doc.setFont("helvetica", "bold");
    doc.text(`${metric.label}:`, marginLeft + 2, yPosition);
    doc.setFont("helvetica", "normal");
    doc.text(metric.value, marginLeft + 50, yPosition);
    yPosition += 5.5;
  });
  
  yPosition += 4;

  // Workout Plan
  if (plan.workout && Object.keys(plan.workout).length > 0) {
    addSection("WORKOUT PLAN", 11);
    
    Object.entries(plan.workout).forEach(([day, exercises]) => {
      checkPageBreak(15);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 100, 0); // Dark green
      doc.text(`${day.charAt(0).toUpperCase() + day.slice(1)}`, marginLeft + 2, yPosition);
      yPosition += 6;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      
      (exercises as string[])?.forEach((ex) => {
        checkPageBreak(5);
        const exerciseLines = doc.splitTextToSize(`• ${ex}`, maxWidth - 8);
        doc.text(exerciseLines, marginLeft + 6, yPosition);
        yPosition += exerciseLines.length * 5.5;
      });
      yPosition += 2;
    });
    
    yPosition += 2;
  }

  // Diet Plan
  if (plan.diet && Object.keys(plan.diet).length > 0) {
    addSection("DIET PLAN", 11);
    
    ["breakfast", "lunch", "dinner", "snacks"].forEach((mealType) => {
      const items = plan.diet?.[mealType as keyof typeof plan.diet];
      if (items && Array.isArray(items) && items.length > 0) {
        checkPageBreak(15);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(139, 69, 19); // Brown color
        doc.text(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`, marginLeft + 2, yPosition);
        yPosition += 6;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        
        (items as any[]).forEach((item) => {
          checkPageBreak(5);
          const costStr = item.cost ? ` - ₹${item.cost}` : "";
          const mealText = `• ${item.meal} (${item.calories} cal)${costStr}`;
          const mealLines = doc.splitTextToSize(mealText, maxWidth - 8);
          doc.text(mealLines, marginLeft + 6, yPosition);
          yPosition += mealLines.length * 5.5;
        });
        yPosition += 2;
      }
    });
    
    yPosition += 2;
  }

  // Tips
  if (plan.tips && plan.tips.length > 0) {
    addSection("TIPS & ADVICE", 11);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    plan.tips.forEach((tip: string) => {
      checkPageBreak(8);
      const tipLines = doc.splitTextToSize(`✓ ${tip}`, maxWidth - 6);
      doc.text(tipLines, marginLeft + 4, yPosition);
      yPosition += tipLines.length * 5.5;
    });
    
    yPosition += 3;
  }

  // Warnings
  if (plan.warnings && plan.warnings.length > 0) {
    checkPageBreak(30);
    addSection("WARNINGS", 11);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 0, 0); // Dark red
    
    plan.warnings.forEach((warning: string) => {
      checkPageBreak(8);
      const warningLines = doc.splitTextToSize(`⚠ ${warning}`, maxWidth - 6);
      doc.text(warningLines, marginLeft + 4, yPosition);
      yPosition += warningLines.length * 5.5;
    });
    
    doc.setTextColor(0, 0, 0);
    yPosition += 3;
  }

  // Shopping List
  if (plan.shoppingList && plan.shoppingList.length > 0) {
    addSection("SHOPPING LIST", 11);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    plan.shoppingList.forEach((item: string) => {
      checkPageBreak(5);
      const itemLines = doc.splitTextToSize(`☐ ${item}`, maxWidth - 4);
      doc.text(itemLines, marginLeft + 3, yPosition);
      yPosition += itemLines.length * 5.5;
    });
  }

  // Footer
  const totalPages = (doc as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" }
    );
  }

  // Generate PDF as buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="fitness-plan-${plan.id}.pdf"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  });
}
