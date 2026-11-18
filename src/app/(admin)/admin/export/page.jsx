export default function AdminExportPage() {
  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-2">Export Data</h1>
      <p className="text-slate-600 mb-4">
        Download all registrations as a CSV file.
      </p>
      <a
        href="/api/admin/export"
        className="inline-block rounded-lg bg-sky-600 text-white px-4 py-2 text-sm font-semibold hover:bg-sky-700"
      >
        Download CSV
      </a>
    </div>
  );
}