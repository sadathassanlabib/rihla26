"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  User,
  HeartPulse,
  Users,
  CreditCard,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Wallet,
  Banknote,
  Lock,
  Eye,
  EyeOff,
  Package,
  History,
  Share2,
} from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const TSHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];

/* ── Fixed package ─────────────────────────────────────────── */
const TRIP_FEE = 3500;
const PACKAGE_TYPE = "roundtrip";

/* ── Google-Form style primitives ────────────────────────────── */

const inputClass =
  "w-full px-0 py-2 bg-transparent border-0 border-b border-slate-300 text-[15px] text-slate-800 " +
  "focus:outline-none focus:border-[#E07A3E] focus:ring-0 transition-colors " +
  "placeholder:text-slate-400";

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  tshirtSize: "",
  address: "",
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",
  password: "",
  confirmPassword: "",
  paymentMode: "",
  paymentMethod: "",
  transactionId: "",
  amountPaid: "",
  cashReceiver: "",
  slipId: "",
  previousTour: "",
  reference: "",
  notes: "",
  agree: false,
};

const t = {
  backHome: "Back to Home",
  pageTitle: "Rihla'26 — Registration",
  subtitle: "Char Kukri Mukri, Bhola · 24 December 2026 · 4–5 Days",
  personalInfo: "Personal Information",
  emergencyContact: "Emergency Contact",
  tshirtSize: "T-Shirt Size",
  security: "Account Security",
  packageInfo: "Your Package",
  paymentInfo: "Payment Information",
  additionalInfo: "Additional Information (Optional)",
  fullName: "Full Name",
  mobile: "Mobile Number",
  email: "Email",
  dob: "Date of Birth",
  gender: "Gender",
  bloodGroup: "Blood Group",
  address: "Address",
  name: "Name",
  size: "Size",
  notes: "Anything you'd like us to know?",
  password: "Password",
  confirmPassword: "Confirm Password",
  phFullName: "Your answer",
  phPhone: "01XXXXXXXXX",
  phEmail: "Your answer",
  phAddress: "Your answer",
  phEmergencyName: "Your answer",
  phTransactionId: "Your answer",
  phNotes: "Your answer",
  phAmount: "Your answer",
  phCashReceiver: "Your answer",
  phSlipId: "Your answer",
  phPassword: "At least 6 characters",
  phConfirmPassword: "Re-enter your password",
  select: "Select",
  male: "Male",
  female: "Female",
  other: "Other",

  relation: "Relationship",
  relationFather: "Father",
  relationMother: "Mother",
  relationSpouse: "Spouse",
  relationSibling: "Sibling",
  relationGuardian: "Guardian",
  relationRelative: "Relative",
  relationFriend: "Friend",
  relationOther: "Other",

  previousTourTitle: "Previous Tour Experience",
  previousTourLabel: "Have you joined a previous tour with us?",
  previousTourYes: "Yes, I have joined before",
  previousTourNo: "No, this is my first time",

  referenceTitle: "How Did You Hear About Us?",
  referenceLabel: "Reference / Source",
  referenceHint: "e.g. Facebook, a friend's name, a coordinator, etc.",
  phReference: "Your answer",

  packageName: "Dhaka Round Trip",
  packageDesc: "Go from Dhaka and return to Dhaka",
  packageFeeLabel: "Package Fee",
  packageFixedNote: "This is the only available package for Rihla'26.",

  paymentMode: "Payment Type",
  modeFull: "Full Payment (Online)",
  modeFullDesc: "I will pay the full amount online now",
  modePartial: "Partial Payment (Online)",
  modePartialDesc: "Some now, the rest later",
  modeCash: "Hand Cash",
  modeCashDesc: "I will pay cash at the office",

  paymentMethod: "Payment Method",
  transactionId: "Transaction ID",
  amountPaid: "Amount paying now",
  remaining: "Remaining",
  paymentNote:
    "Send money via bKash/Nagad/Rocket and enter the transaction ID.",
  onlinePayTo: "Pay online to",

  cashReceiverLabel: "Cash received by",
  cashReceiverHint: "Name of the person/representative you paid cash to",
  slipIdLabel: "Slip / Receipt No.",
  slipIdHint: "The slip or receipt number provided by the organization",
  cashNote:
    "Hand cash does not need a transaction ID. Just enter who received your cash and the slip number.",

  termsText:
    "I confirm that all information provided is correct. I agree to follow the organization's rules during the trip, and I understand that the organizers will not be held liable for any unforeseen incidents.",
  submit: "Submit",
  submitting: "Submitting...",
  cancel: "Clear form",
  goDashboard: "Go to Dashboard",
  backToHome: "Back to Home",
  successTitle: "Registration Complete!",
  successText:
    "Your application has been received. After admin approval, you will be able to see all trip updates.",
  statusPending: "⏳ Status: Pending",

  errFullName: "Please enter your full name",
  errFullNameShort: "Name must be at least 3 characters",
  errPhone: "Please enter your mobile number",
  errPhoneInvalid: "Enter a valid 11-digit mobile number (e.g. 017XXXXXXXX)",
  errEmail: "Please enter your email",
  errEmailInvalid: "Enter a valid email address",
  errDob: "Please select your date of birth",
  errGender: "Please select your gender",
  errBlood: "Please select your blood group",
  errTshirt: "Please select your t-shirt size",
  errAddress: "Please enter your address",
  errEmergencyName: "Please enter an emergency contact name",
  errRelation: "Please select the relationship",
  errEmergencyPhone: "Please enter an emergency contact number",
  errEmergencyPhoneInvalid: "Enter a valid 11-digit number",
  errPassword: "Please enter a password",
  errPasswordShort: "Password must be at least 6 characters",
  errPasswordMatch: "Passwords do not match",
  errPaymentMode: "Please select a payment type",
  errPaymentMethod: "Please select a payment method",
  errTransaction: "Please enter the transaction ID",
  errAmount: "Please enter the amount",
  errAmountInvalid: "Enter a valid amount (greater than 0)",
  errAmountTooMuch: "Amount cannot be more than the package fee",
  errCashReceiver: "Please enter who received your cash",
  errSlipId: "Please enter the slip / receipt number",
  errPreviousTour: "Please let us know if you've joined before",
  errReference: "Please tell us how you heard about us",
  errAgree: "You must agree to the terms and conditions",
  errServer: "Something went wrong, please try again",
  errRegisterFailed: "Registration failed",
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* Package fee is always fixed */
  const tripFee = TRIP_FEE;

  /* Reset amount when payment mode changes */
  useEffect(() => {
    if (form.paymentMode === "full") {
      setForm((p) => ({
        ...p,
        amountPaid: String(TRIP_FEE),
        cashReceiver: "",
        slipId: "",
      }));
    } else if (form.paymentMode === "partial") {
      setForm((p) => ({
        ...p,
        amountPaid: p.amountPaid || "",
        cashReceiver: "",
        slipId: "",
      }));
    } else if (form.paymentMode === "cash") {
      setForm((p) => ({
        ...p,
        paymentMethod: "",
        transactionId: "",
        amountPaid: p.amountPaid || "",
      }));
    }
  }, [form.paymentMode]);

  const amountNum = parseInt(form.amountPaid || "0", 10) || 0;
  const remaining = Math.max(tripFee - amountNum, 0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const setField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};

    if (!form.fullName.trim()) err.fullName = t.errFullName;
    else if (form.fullName.trim().length < 3)
      err.fullName = t.errFullNameShort;

    if (!form.phone.trim()) err.phone = t.errPhone;
    else if (!/^01[3-9]\d{8}$/.test(form.phone))
      err.phone = t.errPhoneInvalid;

    if (!form.email.trim()) err.email = t.errEmail;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = t.errEmailInvalid;

    if (!form.dob) err.dob = t.errDob;
    if (!form.gender) err.gender = t.errGender;
    if (!form.bloodGroup) err.bloodGroup = t.errBlood;
    if (!form.tshirtSize) err.tshirtSize = t.errTshirt;
    if (!form.address.trim()) err.address = t.errAddress;

    if (!form.emergencyName.trim()) err.emergencyName = t.errEmergencyName;
    if (!form.emergencyRelation) err.emergencyRelation = t.errRelation;
    if (!form.emergencyPhone.trim())
      err.emergencyPhone = t.errEmergencyPhone;
    else if (!/^01[3-9]\d{8}$/.test(form.emergencyPhone))
      err.emergencyPhone = t.errEmergencyPhoneInvalid;

    if (!form.previousTour) err.previousTour = t.errPreviousTour;
    if (!form.reference.trim()) err.reference = t.errReference;

    if (!form.password) err.password = t.errPassword;
    else if (form.password.length < 6) err.password = t.errPasswordShort;

    if (!form.confirmPassword) err.confirmPassword = t.errPassword;
    else if (form.password !== form.confirmPassword)
      err.confirmPassword = t.errPasswordMatch;

    if (!form.paymentMode) err.paymentMode = t.errPaymentMode;

    if (form.paymentMode === "full" || form.paymentMode === "partial") {
      if (!form.paymentMethod) err.paymentMethod = t.errPaymentMethod;
      if (!form.transactionId.trim()) err.transactionId = t.errTransaction;
    }

    if (form.paymentMode === "cash") {
      if (!form.cashReceiver.trim()) err.cashReceiver = t.errCashReceiver;
      if (!form.slipId.trim()) err.slipId = t.errSlipId;
    }

    if (form.paymentMode === "partial" || form.paymentMode === "cash") {
      if (!form.amountPaid.trim()) err.amountPaid = t.errAmount;
      else if (amountNum <= 0) err.amountPaid = t.errAmountInvalid;
      else if (amountNum > tripFee) err.amountPaid = t.errAmountTooMuch;
    }

    if (!form.agree) err.agree = t.errAgree;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        packageType: PACKAGE_TYPE,
        amountPaid: amountNum,
        remaining,
        tripFee,
        packageFee: tripFee,
        paymentStatus:
          remaining === 0 ? "paid" : amountNum > 0 ? "partial" : "unpaid",
      };
      delete payload.confirmPassword;

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || t.errRegisterFailed);

      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      setSuccess(true);
      setForm(initialForm);
    } catch (err) {
      setServerError(err.message || t.errServer);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success Screen ── */
  if (success) {
    return (
      <main className="min-h-screen bg-[#F0EBE3] flex items-start justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-2 bg-[#1D423A]" />
          <div className="p-8">
            <div className="w-14 h-14 rounded-full bg-[#DFC5A6] text-[#1D423A] flex items-center justify-center mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-normal text-slate-900">
              {t.successTitle}
            </h1>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {t.successText}
            </p>

            <div className="mt-6 inline-block bg-[#F0EBE3] text-[#1D423A] text-sm px-4 py-2 rounded border border-[#DFC5A6]">
              {t.statusPending}
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <Link
                href="/status"
                className="px-6 py-2.5 bg-[#1D423A] text-white rounded-md font-medium text-sm text-center hover:bg-[#246A73] transition"
              >
                {t.goDashboard}
              </Link>
              <Link
                href="/"
                className="px-6 py-2.5 text-[#E07A3E] rounded-md font-medium text-sm text-center hover:bg-[#F0EBE3] transition"
              >
                {t.backToHome}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ── Main Form ── */
  return (
    <main className="min-h-screen bg-[#F0EBE3] py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[#1D423A] mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backHome}
        </Link>

        {/* Form Header */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-4">
          <div className="h-2.5 bg-[#1D423A]" />
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#DFC5A6]/50 text-[#1D423A] text-xs font-medium mb-4">
              <MapPin className="w-3 h-3" />
              SOROB · Rihla'26
            </div>

            <h1 className="text-[28px] md:text-[32px] font-normal text-slate-900 leading-tight">
              {t.pageTitle}
            </h1>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {t.subtitle}
            </p>

            <p className="text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
              <span className="text-[#E07A3E]">*</span> Indicates required
              question
            </p>
          </div>
        </div>

        {serverError && (
          <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm p-4 rounded-lg mb-4 border border-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── 1. Personal Info ── */}
          <FormCard title={t.personalInfo} icon={User}>
            <Field label={t.fullName} required error={errors.fullName}>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder={t.phFullName}
                className={inputClass}
              />
            </Field>

            <Field label={t.mobile} required error={errors.phone}>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder={t.phPhone}
                className={inputClass}
              />
            </Field>

            <Field label={t.email} required error={errors.email}>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t.phEmail}
                className={inputClass}
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label={t.dob} required error={errors.dob}>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>

              <Field label={t.bloodGroup} required error={errors.bloodGroup}>
                <select
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="">{t.select}</option>
                  {BLOOD_GROUPS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={t.gender} required error={errors.gender}>
              <RadioGroup
                name="gender"
                value={form.gender}
                options={[
                  { value: "male", label: t.male },
                  { value: "female", label: t.female },
                  { value: "other", label: t.other },
                ]}
                onChange={(v) => setField("gender", v)}
              />
            </Field>

            <Field label={t.address} required error={errors.address}>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={2}
                placeholder={t.phAddress}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </FormCard>

          {/* ── 2. Emergency Contact ── */}
          <FormCard title={t.emergencyContact} icon={HeartPulse}>
            <Field label={t.name} required error={errors.emergencyName}>
              <input
                type="text"
                name="emergencyName"
                value={form.emergencyName}
                onChange={handleChange}
                placeholder={t.phEmergencyName}
                className={inputClass}
              />
            </Field>

            <Field
              label={t.relation}
              required
              error={errors.emergencyRelation}
            >
              <select
                name="emergencyRelation"
                value={form.emergencyRelation}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">{t.select}</option>
                <option value="father">{t.relationFather}</option>
                <option value="mother">{t.relationMother}</option>
                <option value="spouse">{t.relationSpouse}</option>
                <option value="sibling">{t.relationSibling}</option>
                <option value="guardian">{t.relationGuardian}</option>
                <option value="relative">{t.relationRelative}</option>
                <option value="friend">{t.relationFriend}</option>
                <option value="other">{t.relationOther}</option>
              </select>
            </Field>

            <Field label={t.mobile} required error={errors.emergencyPhone}>
              <input
                type="tel"
                name="emergencyPhone"
                value={form.emergencyPhone}
                onChange={handleChange}
                placeholder={t.phPhone}
                className={inputClass}
              />
            </Field>
          </FormCard>

          {/* ── 3. Previous Tour ── */}
          <FormCard title={t.previousTourTitle} icon={History}>
            <Field
              label={t.previousTourLabel}
              required
              error={errors.previousTour}
            >
              <RadioGroup
                name="previousTour"
                value={form.previousTour}
                options={[
                  { value: "yes", label: t.previousTourYes },
                  { value: "no", label: t.previousTourNo },
                ]}
                onChange={(v) => setField("previousTour", v)}
              />
            </Field>
          </FormCard>

          {/* ── 4. Reference ── */}
          <FormCard title={t.referenceTitle} icon={Share2}>
            <Field
              label={t.referenceLabel}
              required
              error={errors.reference}
              hint={t.referenceHint}
            >
              <input
                type="text"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder={t.phReference}
                className={inputClass}
              />
            </Field>
          </FormCard>

          {/* ── 5. T-Shirt Size ── */}
          <FormCard title={t.tshirtSize} icon={Users}>
            <Field label={t.size} required error={errors.tshirtSize}>
              <ChipGroup
                options={TSHIRT_SIZES}
                value={form.tshirtSize}
                onChange={(v) => setField("tshirtSize", v)}
              />
            </Field>
          </FormCard>

          {/* ── 6. Account Security ── */}
          <FormCard title={t.security} icon={Lock}>
            <Field label={t.password} required error={errors.password}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={t.phPassword}
                  autoComplete="new-password"
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-[#1D423A] transition"
                  aria-label="Toggle password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </Field>

            <Field
              label={t.confirmPassword}
              required
              error={errors.confirmPassword}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder={t.phConfirmPassword}
                autoComplete="new-password"
                className={inputClass}
              />
            </Field>
          </FormCard>

          {/* ── 7. Package (FIXED) ── */}
          <FormCard title={t.packageInfo} icon={Package}>
            <div className="rounded-md border border-[#DFC5A6] bg-[#F0EBE3] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#1D423A]">
                    {t.packageName}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {t.packageDesc}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    {t.packageFeeLabel}
                  </p>
                  <p className="text-xl font-bold text-[#1D423A]">
                    ৳ {TRIP_FEE}
                  </p>
                </div>
              </div>

              <p className="mt-3 pt-3 border-t border-[#DFC5A6] text-xs text-slate-500">
                {t.packageFixedNote}
              </p>
            </div>
          </FormCard>

          {/* ── 8. Payment ── */}
          <FormCard title={t.paymentInfo} icon={CreditCard}>
            <Field label={t.paymentMode} required error={errors.paymentMode}>
              <RadioGroup
                name="paymentMode"
                value={form.paymentMode}
                options={[
                  {
                    value: "full",
                    label: t.modeFull,
                    desc: t.modeFullDesc,
                    icon: CreditCard,
                  },
                  {
                    value: "partial",
                    label: t.modePartial,
                    desc: t.modePartialDesc,
                    icon: Wallet,
                  },
                  {
                    value: "cash",
                    label: t.modeCash,
                    desc: t.modeCashDesc,
                    icon: Banknote,
                  },
                ]}
                onChange={(v) => setField("paymentMode", v)}
                vertical
              />
            </Field>

            {(form.paymentMode === "full" ||
              form.paymentMode === "partial") && (
              <>
                <div className="text-sm text-slate-600 bg-[#F0EBE3] rounded-md p-3 border border-[#DFC5A6]/60 leading-relaxed">
                  <strong>{t.onlinePayTo}:</strong>
                  <br />
                  <strong>bKash:</strong> 017XXXXXXXX &nbsp;|&nbsp;{" "}
                  <strong>Nagad:</strong> 017XXXXXXXX &nbsp;|&nbsp;{" "}
                  <strong>Rocket:</strong> 017XXXXXXXX
                  <br />
                  {t.paymentNote}
                </div>

                <Field
                  label={t.paymentMethod}
                  required
                  error={errors.paymentMethod}
                >
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">{t.select}</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                  </select>
                </Field>

                <Field
                  label={t.transactionId}
                  required
                  error={errors.transactionId}
                >
                  <input
                    type="text"
                    name="transactionId"
                    value={form.transactionId}
                    onChange={handleChange}
                    placeholder={t.phTransactionId}
                    className={inputClass}
                  />
                </Field>
              </>
            )}

            {form.paymentMode === "cash" && (
              <>
                <div className="text-sm text-slate-600 bg-[#F0EBE3] rounded-md p-3 border border-[#DFC5A6]/60 leading-relaxed">
                  {t.cashNote}
                </div>

                <Field
                  label={t.cashReceiverLabel}
                  required
                  error={errors.cashReceiver}
                  hint={t.cashReceiverHint}
                >
                  <input
                    type="text"
                    name="cashReceiver"
                    value={form.cashReceiver}
                    onChange={handleChange}
                    placeholder={t.phCashReceiver}
                    className={inputClass}
                  />
                </Field>

                <Field
                  label={t.slipIdLabel}
                  required
                  error={errors.slipId}
                  hint={t.slipIdHint}
                >
                  <input
                    type="text"
                    name="slipId"
                    value={form.slipId}
                    onChange={handleChange}
                    placeholder={t.phSlipId}
                    className={inputClass}
                  />
                </Field>
              </>
            )}

            {(form.paymentMode === "partial" ||
              form.paymentMode === "cash") && (
              <>
                <Field
                  label={t.amountPaid}
                  required
                  error={errors.amountPaid}
                >
                  <input
                    type="number"
                    name="amountPaid"
                    value={form.amountPaid}
                    onChange={handleChange}
                    min="1"
                    max={TRIP_FEE}
                    placeholder={t.phAmount}
                    className={inputClass}
                  />
                </Field>

                {amountNum > 0 && (
                  <div className="flex items-center justify-between bg-[#F0EBE3] rounded-md p-3 border border-[#DFC5A6]/60">
                    <span className="text-sm text-[#1D423A] font-medium">
                      {t.remaining}
                    </span>
                    <span className="text-base font-bold text-[#1D423A]">
                      ৳ {remaining}
                    </span>
                  </div>
                )}
              </>
            )}
          </FormCard>

          {/* ── 9. Additional Info ── */}
          <FormCard title={t.additionalInfo} icon={MapPin}>
            <Field label={t.notes}>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder={t.phNotes}
                className={`${inputClass} resize-none`}
              />
            </Field>
          </FormCard>

          {/* ── 10. Terms ── */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="mt-1 w-4 h-4 accent-[#1D423A]"
              />
              <span className="text-sm text-slate-700 leading-relaxed">
                {t.termsText}
              </span>
            </label>
            {errors.agree && (
              <p className="text-red-600 text-xs mt-2 ml-7">{errors.agree}</p>
            )}
          </div>

          {/* ── Submit row ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-[#1D423A] text-white rounded-md font-medium text-sm hover:bg-[#246A73] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.submit
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm(initialForm);
                setErrors({});
              }}
              className="px-4 py-2 text-sm font-medium text-[#E07A3E] hover:bg-[#F0EBE3] rounded-md transition"
            >
              {t.cancel}
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center pt-2">
            Never submit passwords through other forms. This form is secured
            by SOROB.
          </p>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Organized by SOROB · Rihla'26
        </p>
      </div>
    </main>
  );
}

/* ─── Google-Form styled helpers ─────────────────────────────── */

function FormCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-md bg-[#DFC5A6]/50 text-[#1D423A] flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </span>
          <h2 className="text-[15px] font-medium text-slate-800">{title}</h2>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 space-y-6">{children}</div>
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm text-slate-800 mb-1">
        {label} {required && <span className="text-[#E07A3E]">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1 text-[#c5221f] text-xs mt-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function RadioGroup({ name, value, options, onChange, vertical }) {
  return (
    <div className={vertical ? "space-y-2.5" : "space-y-2.5"}>
      {options.map((opt) => {
        const active = value === opt.value;
        const Icon = opt.icon;
        return (
          <label
            key={opt.value}
            className="flex items-start gap-3 cursor-pointer group py-1"
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                active
                  ? "border-[#1D423A]"
                  : "border-slate-400 group-hover:border-slate-600"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full transition-transform ${
                  active ? "bg-[#1D423A] scale-100" : "scale-0"
                }`}
              />
            </span>

            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={active}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />

            <div className="-mt-0.5">
              <span
                className={`text-sm ${
                  active ? "text-slate-900" : "text-slate-700"
                } flex items-center gap-1.5`}
              >
                {Icon && <Icon className="w-4 h-4 text-[#1D423A]" />}
                {opt.label}
              </span>
              {opt.desc && (
                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}

function ChipGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-1.5 rounded-md border text-sm font-medium transition ${
              active
                ? "bg-[#1D423A] text-white border-[#1D423A]"
                : "bg-white text-slate-700 border-slate-300 hover:border-[#1D423A]"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}