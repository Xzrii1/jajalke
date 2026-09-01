"use client";

import { ReportPanel } from "@/components/report-panel";
import { Card } from "@/components/ui";

export default function AdminLaporanPage() {
  return (
    <div className="anim-rise space-y-5">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">
          Laporan Transaksi
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Susun laporan peminjaman dan pengembalian buku, lalu unduh sebagai Excel/PDF atau cetak.
        </p>
      </div>

      <Card className="p-5 sm:p-6">
        <ReportPanel />
      </Card>
    </div>
  );
}
