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
  ReceiptText,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  Package,
  Bus,
  Car,
  Footprints,
  History,
  Share2,
} from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const TSHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];

const PACKAGES = {
  roundtrip: { fee: 3500 },
  oneway: { fee: 3000 },
  destination: { fee: 2500 },
};

const inputClass =
  "w-full px-3 py-2.5 border border-sky-100 rounded-lg text-sm text-slate-700 bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-sky-400 " +
  "placeholder:text-slate-400 transition";

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
  packageType: "",
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
  packageInfo: "Select a Package",
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
  phFullName: "Your full name",
  phPhone: "01XXXXXXXXX",
  phEmail: "you@example.com",
  phAddress: "House / Road, Area, City",
  phEmergencyName: "Family member's name",
  phTransactionId: "e.g. 9F7A2B1C3D",
  phNotes: "Dietary preferences, medical conditions, etc.",
  phAmount: "Amount you paid",
  phCashReceiver: "e.g. Sadat Hasan (Coordinator)",
  phSlipId: "e.g. SLP-2026-014",
  phPassword: "At least 6 characters",
  phConfirmPassword: "Re-enter your password",
  select: "Select",
  male: "Male",
  female: "Female",
  other: "Other",

  // Emergency relationship
  relation: "Relationship",
  relationFather: "Father",
  relationMother: "Mother",
  relationSpouse: "Spouse",
  relationSibling: "Sibling",
  relationGuardian: "Guardian",
  relationRelative: "Relative",
  relationFriend: "Friend",
  relationOther: "Other",

  // Previous tour
  previousTourTitle: "Previous Tour Experience",
  previousTourLabel: "Have you joined a previous tour with us?",
  previousTourYes: "Yes, I have joined before",
  previousTourNo: "No, this is my first time",

  // Reference
  referenceTitle: "How Did You Hear About Us?",
  referenceLabel: "Reference / Source",
  referenceHint: "e.g. Facebook, a friend's name, a coordinator, etc.",
  phReference: "How did you find out about Rihla'26?",

  pkgRoundTrip: "Dhaka Round Trip",
  pkgRoundTripDesc: "Go from Dhaka and return to Dhaka",
  pkgOneWay: "Dhaka One-Way",
  pkgOneWayDesc: "Go from Dhaka, return on your own",
  pkgDestination: "Join at Destination",
  pkgDestinationDesc: "Reach the destination yourself, no return",
  pkgFee: "Package Fee",

  tripFee: "Trip Fee",
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
  submit: "Submit Registration",
  submitting: "Submitting...",
  cancel: "Cancel",
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
  errPackage: "Please select a package",
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

  const tripFee = PACKAGES[form.packageType]?.fee || 0;

  useEffect(() => {
    setForm((p) => ({ ...p, amountPaid: "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.packageType]);

  useEffect(() => {
    if (form.paymentMode === "full") {
      setForm((p) => ({
        ...p,
        amountPaid: String(tripFee),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.paymentMode]);

  const amountNum = parseInt(form.amountPaid || "0", 10) || 0;
  const remaining = Math.max(tripFee - amountNum, 0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

    if (!form.emergencyName.trim())
      err.emergencyName = t.errEmergencyName;

    if (!form.emergencyRelation)
      err.emergencyRelation = t.errRelation;

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

    if (!form.packageType) err.packageType = t.errPackage;

    if (!form.paymentMode) err.paymentMode = t.errPaymentMode;

    if (form.paymentMode === "full" || form.paymentMode === "partial") {
      if (!form.paymentMethod) err.paymentMethod = t.errPaymentMethod;
      if (!form.transactionId.trim()) err.transactionId = t.errTransaction;
    }

    if (form.paymentMode === "cash") {
      if (!form.cashReceiver.trim())
        err.cashReceiver = t.errCashReceiver;
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

      if (!res.ok) {
        throw new Error(data.message || t.errRegisterFailed);
      }

      // Auto-login
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

  // Success Screen
  if (success) {
    return (
      <main className="min-h-screen bg-[#F0F9FF] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-sky-100 p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {t.successTitle}
          </h1>

          <p className="text-slate-600 mb-6 leading-relaxed">
            {t.successText}
          </p>

          <div className="inline-block bg-sky-50 text-sky-700 text-sm px-4 py-2 rounded-lg mb-6 border border-sky-100">
            {t.statusPending}
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/status"
              className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition"
            >
              {t.goDashboard}
            </Link>

            <Link
              href="/"
              className="px-6 py-3 border border-sky-100 text-slate-700 rounded-xl font-semibold hover:bg-sky-50 transition"
            >
              {t.backToHome}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0F9FF] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-sky-600 mb-5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backHome}
        </Link>

        <div className="bg-white rounded-2xl border border-sky-100 shadow-sm p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold mb-4">
              <MapPin className="w-3.5 h-3.5" />
              SOROB · Rihla'26
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {t.pageTitle}
            </h1>

            <p className="text-slate-500 mt-2 text-sm md:text-base">
              {t.subtitle}
            </p>

            <div className="mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-sky-500 to-blue-400" />
          </div>

          {serverError && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-6 border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Personal Info */}
            <Section
              title={t.personalInfo}
              icon={<User className="w-4 h-4" />}
            >
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

              <div className="grid sm:grid-cols-2 gap-4">
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
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t.dob} required error={errors.dob}>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label={t.gender} required error={errors.gender}>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">{t.select}</option>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t.bloodGroup} required error={errors.bloodGroup}>
                  <select
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className={inputClass}
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
            </Section>

            {/* 2. Emergency Contact */}
            <Section
              title={t.emergencyContact}
              icon={<HeartPulse className="w-4 h-4" />}
            >
              <div className="grid sm:grid-cols-3 gap-4">
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
                    className={inputClass}
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

                <Field
                  label={t.mobile}
                  required
                  error={errors.emergencyPhone}
                >
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={form.emergencyPhone}
                    onChange={handleChange}
                    placeholder={t.phPhone}
                    className={inputClass}
                  />
                </Field>
              </div>
            </Section>

            {/* 3. Previous Tour Experience */}
            <Section
              title={t.previousTourTitle}
              icon={<History className="w-4 h-4" />}
            >
              <Field
                label={t.previousTourLabel}
                required
                error={errors.previousTour}
              >
                <div className="grid sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, previousTour: "yes" }))
                    }
                    className={`text-left p-3 rounded-xl border transition ${
                      form.previousTour === "yes"
                        ? "bg-sky-50 border-sky-500 ring-1 ring-sky-400"
                        : "bg-white border-sky-100 hover:border-sky-300"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 font-semibold text-sm ${
                        form.previousTour === "yes"
                          ? "text-sky-700"
                          : "text-slate-800"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {t.previousTourYes}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, previousTour: "no" }))
                    }
                    className={`text-left p-3 rounded-xl border transition ${
                      form.previousTour === "no"
                        ? "bg-sky-50 border-sky-500 ring-1 ring-sky-400"
                        : "bg-white border-sky-100 hover:border-sky-300"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 font-semibold text-sm ${
                        form.previousTour === "no"
                          ? "text-sky-700"
                          : "text-slate-800"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      {t.previousTourNo}
                    </div>
                  </button>
                </div>
              </Field>
            </Section>

            {/* 4. Reference */}
            <Section
              title={t.referenceTitle}
              icon={<Share2 className="w-4 h-4" />}
            >
              <Field
                label={t.referenceLabel}
                required
                error={errors.reference}
              >
                <input
                  type="text"
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  placeholder={t.phReference}
                  className={inputClass}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {t.referenceHint}
                </p>
              </Field>
            </Section>

            {/* 5. T-Shirt Size */}
            <Section
              title={t.tshirtSize}
              icon={<Users className="w-4 h-4" />}
            >
              <Field label={t.size} required error={errors.tshirtSize}>
                <div className="flex flex-wrap gap-2">
                  {TSHIRT_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, tshirtSize: size }))
                      }
                      className={`px-5 py-2 rounded-lg border font-medium text-sm transition ${
                        form.tshirtSize === size
                          ? "bg-sky-600 text-white border-sky-600"
                          : "bg-white text-slate-700 border-sky-100 hover:border-sky-400 hover:bg-sky-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </Field>
            </Section>

            {/* 6. Account Security */}
            <Section title={t.security} icon={<Lock className="w-4 h-4" />}>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label={t.password} required error={errors.password}>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder={t.phPassword}
                      autoComplete="new-password"
                      className={`${inputClass} pl-9 pr-10`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-sky-600"
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
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder={t.phConfirmPassword}
                      autoComplete="new-password"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>
              </div>
            </Section>

            {/* 7. Package */}
            <Section
              title={t.packageInfo}
              icon={<Package className="w-4 h-4" />}
            >
              <div className="grid sm:grid-cols-3 gap-2">
                <PackageCard
                  active={form.packageType === "roundtrip"}
                  onClick={() =>
                    setForm((p) => ({ ...p, packageType: "roundtrip" }))
                  }
                  icon={<Bus className="w-4 h-4" />}
                  title={t.pkgRoundTrip}
                  desc={t.pkgRoundTripDesc}
                  fee={3500}
                />

                <PackageCard
                  active={form.packageType === "oneway"}
                  onClick={() =>
                    setForm((p) => ({ ...p, packageType: "oneway" }))
                  }
                  icon={<Car className="w-4 h-4" />}
                  title={t.pkgOneWay}
                  desc={t.pkgOneWayDesc}
                  fee={3000}
                />

                <PackageCard
                  active={form.packageType === "destination"}
                  onClick={() =>
                    setForm((p) => ({ ...p, packageType: "destination" }))
                  }
                  icon={<Footprints className="w-4 h-4" />}
                  title={t.pkgDestination}
                  desc={t.pkgDestinationDesc}
                  fee={2500}
                />
              </div>

              {errors.packageType && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.packageType}
                </p>
              )}

              {form.packageType && (
                <div className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-lg p-3">
                  <span className="text-sm text-sky-800 font-medium">
                    {t.pkgFee}
                  </span>

                  <span className="text-lg font-bold text-sky-700">
                    ৳ {tripFee}
                  </span>
                </div>
              )}
            </Section>

            {/* 8. Payment */}
            <Section
              title={t.paymentInfo}
              icon={<CreditCard className="w-4 h-4" />}
            >
              <Field label={t.paymentMode} required error={errors.paymentMode}>
                <div className="grid sm:grid-cols-3 gap-2">
                  <PayModeCard
                    active={form.paymentMode === "full"}
                    onClick={() =>
                      setForm((p) => ({ ...p, paymentMode: "full" }))
                    }
                    icon={<CreditCard className="w-4 h-4" />}
                    title={t.modeFull}
                    desc={t.modeFullDesc}
                  />

                  <PayModeCard
                    active={form.paymentMode === "partial"}
                    onClick={() =>
                      setForm((p) => ({ ...p, paymentMode: "partial" }))
                    }
                    icon={<Wallet className="w-4 h-4" />}
                    title={t.modePartial}
                    desc={t.modePartialDesc}
                  />

                  <PayModeCard
                    active={form.paymentMode === "cash"}
                    onClick={() =>
                      setForm((p) => ({ ...p, paymentMode: "cash" }))
                    }
                    icon={<Banknote className="w-4 h-4" />}
                    title={t.modeCash}
                    desc={t.modeCashDesc}
                  />
                </div>
              </Field>

              {(form.paymentMode === "full" ||
                form.paymentMode === "partial") && (
                <>
                  <p className="text-sm text-slate-600 bg-sky-50 border border-sky-100 rounded-lg p-3">
                    <strong>{t.onlinePayTo}:</strong>
                    <br />
                    <strong>bKash:</strong> 017XXXXXXXX &nbsp;|&nbsp;
                    <strong>Nagad:</strong> 017XXXXXXXX &nbsp;|&nbsp;
                    <strong>Rocket:</strong> 017XXXXXXXX
                    <br />
                    {t.paymentNote}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label={t.paymentMethod}
                      required
                      error={errors.paymentMethod}
                    >
                      <select
                        name="paymentMethod"
                        value={form.paymentMethod}
                        onChange={handleChange}
                        className={inputClass}
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
                  </div>
                </>
              )}

              {form.paymentMode === "cash" && (
                <>
                  <p className="text-sm text-sky-800 bg-sky-50 border border-sky-100 rounded-lg p-3">
                    {t.cashNote}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label={t.cashReceiverLabel}
                      required
                      error={errors.cashReceiver}
                    >
                      <div className="relative">
                        <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                        <input
                          type="text"
                          name="cashReceiver"
                          value={form.cashReceiver}
                          onChange={handleChange}
                          placeholder={t.phCashReceiver}
                          className={`${inputClass} pl-9`}
                        />
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {t.cashReceiverHint}
                      </p>
                    </Field>

                    <Field
                      label={t.slipIdLabel}
                      required
                      error={errors.slipId}
                    >
                      <div className="relative">
                        <ReceiptText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                        <input
                          type="text"
                          name="slipId"
                          value={form.slipId}
                          onChange={handleChange}
                          placeholder={t.phSlipId}
                          className={`${inputClass} pl-9`}
                        />
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {t.slipIdHint}
                      </p>
                    </Field>
                  </div>
                </>
              )}

              {(form.paymentMode === "partial" ||
                form.paymentMode === "cash") && (
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
                    max={tripFee || undefined}
                    placeholder={t.phAmount}
                    className={inputClass}
                  />
                </Field>
              )}

              {(form.paymentMode === "partial" ||
                form.paymentMode === "cash") &&
                amountNum > 0 &&
                tripFee > 0 && (
                  <div className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-lg p-3">
                    <span className="text-sm text-sky-800 font-medium">
                      {t.remaining}
                    </span>

                    <span className="text-lg font-bold text-sky-700">
                      ৳ {remaining}
                    </span>
                  </div>
                )}
            </Section>

            {/* 9. Additional Info */}
            <Section
              title={t.additionalInfo}
              icon={<MapPin className="w-4 h-4" />}
            >
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
            </Section>

            {/* 10. Terms */}
            <div className="border-t border-sky-100 pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 accent-sky-600"
                />

                <span className="text-sm text-slate-600 leading-relaxed">
                  {t.termsText}
                </span>
              </label>

              {errors.agree && (
                <p className="text-red-600 text-sm mt-1">{errors.agree}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-semibold hover:from-sky-700 hover:to-blue-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.submitting}
                  </>
                ) : (
                  <>{t.submit}</>
                )}
              </button>

              <Link
                href="/"
                className="px-6 py-3 border border-sky-100 text-slate-700 rounded-xl font-semibold hover:bg-sky-50 transition text-center"
              >
                {t.cancel}
              </Link>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Organized by SOROB · Rihla'26
        </p>
      </div>
    </main>
  );
}

// ─── Helper Components ───

function Section({ title, icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-sky-100">
        <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
          {icon}
        </span>

        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {children}

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

function PayModeCard({ active, onClick, icon, title, desc }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-3 rounded-xl border transition ${
        active
          ? "bg-sky-50 border-sky-500 ring-1 ring-sky-400"
          : "bg-white border-sky-100 hover:border-sky-300"
      }`}
    >
      <div
        className={`flex items-center gap-2 mb-1 font-semibold text-sm ${
          active ? "text-sky-700" : "text-slate-800"
        }`}
      >
        {icon}
        {title}
      </div>

      <p className="text-xs text-slate-500 leading-snug">{desc}</p>
    </button>
  );
}

function PackageCard({ active, onClick, icon, title, desc, fee }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-3 rounded-xl border transition ${
        active
          ? "bg-sky-50 border-sky-500 ring-1 ring-sky-400"
          : "bg-white border-sky-100 hover:border-sky-300"
      }`}
    >
      <div
        className={`flex items-center gap-2 mb-1 font-semibold text-sm ${
          active ? "text-sky-700" : "text-slate-800"
        }`}
      >
        {icon}
        {title}
      </div>

      <p className="text-xs text-slate-500 leading-snug mb-2">{desc}</p>

      <p
        className={`text-base font-bold ${
          active ? "text-sky-700" : "text-slate-900"
        }`}
      >
        ৳ {fee}
      </p>
    </button>
  );
}