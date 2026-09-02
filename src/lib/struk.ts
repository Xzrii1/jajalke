import { formatTanggal } from "./utils";
import type { Transaksi } from "./types";

/** Membangun HTML struk pinjam buku bergaya struk thermal (lebar 80mm). */
export function renderStruk(t: Transaksi): string {
  const noStruk = (t.id ?? "").slice(0, 8).toUpperCase();
  const peminjam = t.user?.nama_lengkap ?? "-";
  const kelas = t.user?.kelas ? `Kelas ${t.user.kelas}` : "-";
  const nis = t.user?.no_induk ?? "-";

  const row = (label: string, value: string) =>
    `<tr><td class="label">${label}</td><td class="value">${value}</td></tr>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Struk Peminjaman</title>
  <style>
    body{font-family:'Courier New',Courier,monospace;width:320px;margin:24px auto;color:#111;font-size:12px}
    .center{text-align:center}
    .title{font-size:14px;font-weight:700;letter-spacing:1px;margin:0}
    .muted{color:#555}
    .dash{border-top:1px dashed #666;margin:8px 0}
    .hh{border-top:1.5px solid #111;margin:8px 0}
    table{width:100%;border-collapse:collapse}
    td{padding:2px 0;vertical-align:top}
    td.label{width:110px;color:#333}
    td.value{text-align:right;font-weight:600}
    .highlight{text-align:center;font-size:13px;font-weight:700;margin:6px 0}
    .footer{margin-top:10px;text-align:center;font-size:10px}
    .no-print{position:fixed;top:16px;right:16px;padding:8px 16px;font-size:13px;border:none;border-radius:6px;background:#111;color:#fff;cursor:pointer;font-family:Arial,sans-serif}
    @media print{.no-print{display:none}}
  </style></head><body>
  <button class="no-print" onclick="window.print()">Cetak / Simpan PDF</button>
  <div class="center">
    <p class="title">PERPUSTAKAAN SEKOLAH</p>
    <p class="muted">BUKTI PEMINJAMAN BUKU</p>
    <p class="muted">No. ${noStruk}</p>
    <p class="muted">${formatTanggal(new Date().toISOString())}</p>
  </div>
  <div class="hh"></div>
  <table>
    ${row("Peminjam", peminjam)}
    ${row("Kelas", kelas)}
    ${row("NIS", nis)}
  </table>
  <div class="dash"></div>
  <table>
    ${row("Judul", t.buku?.judul ?? "-")}
    ${row("Penulis", t.buku?.penulis ?? "-")}
    ${row("ISBN", t.buku?.isbn ?? "-")}
    ${row("Tgl Pinjam", formatTanggal(t.tanggal_pinjam))}
    ${row("Jatuh Tempo", formatTanggal(t.tanggal_jatuh_tempo))}
  </table>
  <div class="dash"></div>
  <p class="highlight">KEMBALIKAN SEBELUM JATUH TEMPO</p>
  <p class="footer">
    Terima kasih telah meminjam.<br>
    Keterlambatan dikenakan denda sesuai ketentuan perpustakaan.<br><br>
    --- Digenerate dari aplikasi Perpustakaan Sekolah Digital ---
  </p>
  <script>window.onload=function(){};</` + `script>
  </body></html>`;
}

/** Membuka window baru berisi struk lalu fokus agar user bisa menekan Ctrl+P. */
export function cetakStruk(t: Transaksi): void {
  if (typeof window === "undefined") return;
  const w = window.open("", "_blank", "width=400,height=700");
  if (!w) return;
  w.document.write(renderStruk(t));
  w.document.close();
  setTimeout(() => w.focus(), 120);
}