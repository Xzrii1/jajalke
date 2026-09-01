"use client";

import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getTransaksiReport,
  type ReportData,
} from "@/app/actions/transaksi";
import { formatRupiah, formatTanggal, todayISO } from "@/lib/utils";
import { Alert, Button, Field, Input, Modal, Select, Spinner } from "@/components/ui";

const STATUS_OPTIONS = [
  ["semua", "Semua Status"],
  ["aktif", "Peminjaman Aktif"],
  ["dikembalikan", "Dikembalikan"],
] as const;

function reportTitleRange(dari?: string, sampai?: string) {
  if (dari && sampai) return `${formatTanggal(dari)} — ${formatTanggal(sampai)}`;
  if (dari) return `Sejak ${formatTanggal(dari)}`;
  if (sampai) return `Sampai ${formatTanggal(sampai)}`;
  return "Semua Periode";
}

function buildTableRows(data: ReportData) {
  return data.transaksi.map((t) => [
    formatTanggal(t.tanggal_pinjam),
    formatTanggal(t.tanggal_jatuh_tempo),
    formatTanggal(t.tanggal_kembali) ?? "-",
    t.user?.nama_lengkap ?? "-",
    t.user?.kelas ?? "-",
    t.buku?.judul ?? "-",
    t.status === "dipinjam" ? "Dipinjam" : t.status === "terlambat" ? "Terlambat" : "Dikembalikan",
    t.denda > 0 ? formatRupiah(t.denda) : "-",
  ]);
}

const XLSX_COLS = [
  { wch: 12 },
  { wch: 14 },
  { wch: 14 },
  { wch: 24 },
  { wch: 10 },
  { wch: 32 },
  { wch: 14 },
  { wch: 14 },
];

export function ReportDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"full" | "range">("full");
  const [dari, setDari] = useState(todayISO());
  const [sampai, setSampai] = useState(todayISO());
  const [status, setStatus] = useState("semua");

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getTransaksiReport({
      dari: mode === "range" ? dari : undefined,
      sampai: mode === "range" ? sampai : undefined,
      status,
    });
    setLoading(false);
    if (res.error) {
      setError(res.error);
      setData(null);
      return null;
    }
    setData(res.data ?? null);
    return res.data ?? null;
  }, [mode, dari, sampai, status]);

  function handleLoad() {
    void fetchData();
  }

  function downloadExcel(d: ReportData) {
    const wsData = [
      ["LAPORAN TRANSAKSI PERPUSTAKAAN"],
      [`Periode: ${reportTitleRange(d.dari, d.sampai)}`],
      [`Total Transaksi: ${d.total}`, `Total Denda: ${formatRupiah(d.totalDenda)}`],
      [],
      ["No", "Tgl Pinjam", "Jatuh Tempo", "Tgl Kembali", "Peminjam", "Kelas", "Buku", "Status", "Denda"],
      ...buildTableRows(d).map((r, i) => [i + 1, ...r]),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = [{ wch: 5 }, ...XLSX_COLS];
    XLSX.utils.book_append_sheet(wb, ws, "Transaksi");
    const filename = `laporan-transaksi-${d.dari ?? "full"}-${d.sampai ?? ""}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  function downloadPdf(d: ReportData) {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFontSize(14);
    doc.text("LAPORAN TRANSAKSI PERPUSTAKAAN", 40, 40);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Periode: ${reportTitleRange(d.dari, d.sampai)}`, 40, 58);
    doc.text(
      `Total: ${d.total} | Dipinjam: ${d.totalDipinjam} | Dikembalikan: ${d.totalKembali} | Denda: ${formatRupiah(
        d.totalDenda
      )}`,
      40,
      73
    );
    doc.setTextColor(0);

    autoTable(doc, {
      startY: 90,
      head: [["No", "Tgl Pinjam", "Jatuh Tempo", "Tgl Kembali", "Peminjam", "Kelas", "Buku", "Status", "Denda"]],
      body: buildTableRows(d).map((r, i) => [
        String(i + 1),
        ...r.map(
          (c) => (typeof c === "string" && c.length > 26 ? c.slice(0, 26) + "..." : c)
        ),
      ]),
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 255] },
      margin: { left: 40, right: 40 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Halaman ${i}/${pageCount}`, pageW - 40, doc.internal.pageSize.getHeight() - 20, {
        align: "right",
      });
    }

    const filename = `laporan-transaksi-${d.dari ?? "full"}-${d.sampai ?? ""}.pdf`;
    doc.save(filename);
  }

  function handlePrint(d: ReportData) {
    const rowsHtml = d.transaksi
      .map(
        (t, i) => `<tr>
          <td>${i + 1}</td>
          <td>${formatTanggal(t.tanggal_pinjam)}</td>
          <td>${formatTanggal(t.tanggal_jatuh_tempo)}</td>
          <td>${formatTanggal(t.tanggal_kembali) ?? "-"}</td>
          <td>${t.user?.nama_lengkap ?? "-"}</td>
          <td>${t.user?.kelas ?? "-"}</td>
          <td>${t.buku?.judul ?? "-"}</td>
          <td>${t.status}</td>
          <td>${t.denda > 0 ? formatRupiah(t.denda) : "-"}</td>
        </tr>`
      )
      .join("");

    const w = window.open("", "_blank", "width=900,height=650");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Laporan Transaksi</title>
      <style>
        body{font-family:Arial,Helvetica,sans-serif;margin:28px;color:#111}
        h1{font-size:20px;margin:0} .sub{color:#555;margin:4px 0 16px}
        .meta{display:flex;gap:24px;font-size:12px;margin-bottom:14px}
        table{width:100%;border-collapse:collapse;font-size:11px}
        th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}
        th{background:#4f46e5;color:#fff;font-weight:600}
        tr:nth-child(even){background:#f3f5ff}
        .footer{margin-top:18px;font-size:11px;color:#555}
        @media print{@page{size:landscape;margin:12mm}}
        .no-print{position:fixed;top:16px;right:16px;padding:8px 16px;font-size:13px;border:none;border-radius:6px;background:#4f46e5;color:#fff;cursor:pointer}
      </style></head><body>
      <button class="no-print" onclick="window.print()">Cetak / Simpan PDF</button>
      <h1>LAPORAN TRANSAKSI PERPUSTAKAAN</h1>
      <div class="sub">Periode: ${reportTitleRange(d.dari, d.sampai)} — dicetak ${formatTanggal(todayISO())}</div>
      <div class="meta">
        <span>Total: <b>${d.total}</b></span>
        <span>Dipinjam: <b>${d.totalDipinjam}</b></span>
        <span>Dikembalikan: <b>${d.totalKembali}</b></span>
        <span>Denda: <b>${formatRupiah(d.totalDenda)}</b></span>
      </div>
      <table>
        <thead><tr><th>No</th><th>Tgl Pinjam</th><th>Jatuh Tempo</th><th>Tgl Kembali</th><th>Peminjam</th><th>Kelas</th><th>Buku</th><th>Status</th><th>Denda</th></tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      <div class="footer">Dokumen ini dibuat secara otomatis oleh aplikasi Perpustakaan Sekolah Digital.</div>
      <script>window.onload=function(){};</` +
      `script>
      </body></html>`);
    w.document.close();
    setTimeout(() => w.focus(), 120);
  }

  async function saveExcel() {
    const d = await fetchData();
    if (d) downloadExcel(d);
  }

  async function savePdf() {
    const d = await fetchData();
    if (d) downloadPdf(d);
  }

  async function doPrint() {
    const d = await fetchData();
    if (d) handlePrint(d);
  }

  return (
    <Modal open={open} onClose={onClose} title="Laporan Transaksi" wide>
      <div className="space-y-4">
        {/* Filter */}
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Konfigurasi Laporan
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Jenis Laporan">
              <Select value={mode} onChange={(e) => setMode(e.target.value as "full" | "range")}>
                <option value="full">Full (Semua Periode)</option>
                <option value="range">Rentang Tanggal</option>
              </Select>
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </Field>
            {mode === "range" && (
              <>
                <Field label="Dari tanggal">
                  <Input type="date" value={dari} onChange={(e) => setDari(e.target.value)} />
                </Field>
                <Field label="Sampai tanggal">
                  <Input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)} />
                </Field>
              </>
            )}
          </div>
          {error && (
            <div className="mt-3">
              <Alert kind="error">{error}</Alert>
            </div>
          )}
        </div>

        {/* Hasil & Aksi */}
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Hasil &amp; Unduhan
              </p>
              {data ? (
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {data.total} transaksi · {reportTitleRange(data.dari, data.sampai)}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-400">
                  Klik{" "}
                  <button
                    type="button"
                    onClick={handleLoad}
                    className="font-semibold text-indigo-600 hover:underline"
                  >
                    Muat Data
                  </button>{" "}
                  untuk mengambil data laporan.
                </p>
              )}
            </div>
            <Button variant="secondary" onClick={handleLoad} disabled={loading}>
              {loading ? "Memuat..." : "Muat Data"}
            </Button>
          </div>

          {loading && (
            <div className="mt-4">
              <Spinner label="Memuat data laporan..." />
            </div>
          )}

          {data && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Total Transaksi" value={String(data.total)} tone="slate" />
                <Stat label="Dipinjam" value={String(data.totalDipinjam)} tone="indigo" />
                <Stat label="Dikembalikan" value={String(data.totalKembali)} tone="emerald" />
                <Stat label="Total Denda" value={formatRupiah(data.totalDenda)} tone="rose" />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
                <span className="mr-auto text-xs text-slate-400">
                  Unduh atau cetak laporan berikut:
                </span>
                <Button onClick={saveExcel} disabled={loading} className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a1 1 0 001 1h12a1 1 0 001-1v-2" />
                  </svg>
                  Unduh Excel
                </Button>
                <Button variant="secondary" onClick={savePdf} disabled={loading} className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M5 17v2a1 1 0 001 1h12a1 1 0 001-1v-2" />
                  </svg>
                  Unduh PDF
                </Button>
                <Button variant="secondary" onClick={doPrint} disabled={loading} className="inline-flex items-center gap-1.5">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2M6 14h12v7H6v-7z" />
                  </svg>
                  Cetak
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "slate" | "indigo" | "emerald" | "rose";
}) {
  const tones = {
    slate: "text-slate-800",
    indigo: "text-indigo-600",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
  }[tone];
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-0.5 text-lg font-semibold tabular-nums tracking-tight ${tones}`}>{value}</p>
    </div>
  );
}
