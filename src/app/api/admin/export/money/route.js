import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Donation from "@/models/Donation";
import Expense from "@/models/Expense";
import User from "@/models/User";
import Settings from "@/models/Settings";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    await requireRole("admin");
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  await connectDB();

  const [payments, donations, expenses, users, settings] = await Promise.all([
    Payment.find({}).populate("user", "name email phone").lean(),
    Donation.find({}).lean(),
    Expense.find({}).lean(),
    User.find({ role: { $in: ["pending", "registered", "declined"] } })
      .select("name email phone packageFee role")
      .lean(),
    Settings.findOne({ key: "site" }).lean(),
  ]);

  const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
  const totalDonations = donations.reduce((s, d) => s + d.amount, 0);
  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalCollected + totalDonations - totalSpent;

  const paidByUser = {};
  payments.forEach((p) => {
    const k = p.user?._id?.toString() || p.user?.toString();
    if (k) paidByUser[k] = (paidByUser[k] || 0) + p.amount;
  });

  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryRows = [
    ["Rihla'26 — Financial Summary"],
    ["Generated", new Date().toLocaleString()],
    [],
    ["Metric", "Amount (BDT)"],
    ["Total Collected", totalCollected],
    ["Total Donations", totalDonations],
    ["Total Spent", totalSpent],
    ["Current Balance", balance],
    [],
    ["Registered Users", users.filter((u) => u.role === "registered").length],
    ["Pending Users", users.filter((u) => u.role === "pending").length],
    ["Declined Users", users.filter((u) => u.role === "declined").length],
    ["Payment Entries", payments.length],
    ["Donation Entries", donations.length],
    ["Expense Entries", expenses.length],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary["!cols"] = [{ wch: 28 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

  // Participants sheet
  const participantRows = users.map((u) => {
    const paid = paidByUser[u._id.toString()] || 0;
    const fee = u.packageFee || 0;
    return {
      Name: u.name,
      Email: u.email,
      Phone: u.phone,
      Role: u.role,
      "Package Fee": fee,
      "Total Paid": paid,
      Due: Math.max(0, fee - paid),
      Advance: Math.max(0, paid - fee),
    };
  });
  const wsUsers = XLSX.utils.json_to_sheet(participantRows);
  wsUsers["!cols"] = [
    { wch: 22 }, { wch: 28 }, { wch: 15 }, { wch: 12 },
    { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, wsUsers, "Participants");

  // Payments sheet
  const paymentRows = payments.map((p) => ({
    Date: new Date(p.date).toLocaleDateString("en-GB"),
    User: p.user?.name || "—",
    Email: p.user?.email || "—",
    Amount: p.amount,
    Method: p.method,
    "Transaction ID": p.transactionId || "",
    Correction: p.isCorrection ? "Yes" : "",
    Note: p.note || "",
  }));
  const wsPayments = XLSX.utils.json_to_sheet(paymentRows);
  wsPayments["!cols"] = [
    { wch: 12 }, { wch: 22 }, { wch: 28 }, { wch: 12 },
    { wch: 12 }, { wch: 20 }, { wch: 10 }, { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, wsPayments, "Payments");

  // Donations sheet
  const donationRows = donations.map((d) => ({
    Date: new Date(d.date).toLocaleDateString("en-GB"),
    Donor: d.donorName,
    Amount: d.amount,
    Note: d.note || "",
  }));
  const wsDonations = XLSX.utils.json_to_sheet(donationRows);
  wsDonations["!cols"] = [{ wch: 12 }, { wch: 24 }, { wch: 12 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsDonations, "Donations");

  // Expenses sheet
  const expenseRows = expenses.map((e) => ({
    Date: new Date(e.date).toLocaleDateString("en-GB"),
    Title: e.title,
    Category: e.category,
    Amount: e.amount,
    Vendor: e.vendor || "",
    Note: e.note || "",
  }));
  const wsExpenses = XLSX.utils.json_to_sheet(expenseRows);
  wsExpenses["!cols"] = [
    { wch: 12 }, { wch: 24 }, { wch: 14 }, { wch: 12 },
    { wch: 20 }, { wch: 30 },
  ];
  XLSX.utils.book_append_sheet(wb, wsExpenses, "Expenses");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="rihla26-money-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx"`,
    },
  });
}