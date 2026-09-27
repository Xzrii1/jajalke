"use client";

import { useEffect, useState } from "react";
import { getJamOperasional, updateJamOperasional } from "@/app/actions/jamOperasional";
import {
  DAFTAR_HARI,
  DEFAULT_JAM_OPERASIONAL,
  todayHariKey,
  type HariKey,
  type JamOperasional,
} from "@/lib/jamOperasional";
import { Alert, Badge, Button, Card, Spinner } from "@/components/ui";
import type { ActionResult } from "@/lib/types";

interface Row {
  hari: HariKey;
  libur: boolean;
  buka: string;
  tutup: string;
}

function dataToRows(d: JamOperasional): Row[] {
  return DAFTAR_HARI.map((h) => {
    const saved = d[h.key];
    const def = DEFAULT_JAM_OPERASIONAL[h.key];
    return {
      hari: h.key,
      libur: !saved,
      buka: saved?.buka ?? def?.buka ?? "08:00",
      tutup: saved?.tutup ?? def?.tutup ?? "16:00",
    };
  });
}

function rowsToData(rows: Row[]): JamOperasional {
  const d: JamOperasional = {};
  for (const r of rows) {
    if (!r.libur) d[r.hari] = { buka: r.buka, tutup: r.tutup };
  }
  return d;
}

function formatJam(v: string): string {
  const [h, m] = v.split(":");
  return `${h}.${m}`;
}

export function JamOperasionalCard({ editable = false }: { editable?: boolean }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<ActionResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    getJamOperasional().then((res) => {
      if (cancelled) return;
      if (res.error) setMessage({ error: res.error });
      else setRows(dataToRows(res.data));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const today = todayHariKey();

  async function handleSave() {
    if (!rows) return;
    setSaving(true);
    setMessage(null);
    const res = await updateJamOperasional(rowsToData(rows));
    setMessage(res);
    setSaving(false);
    if (res.success) setRows(dataToRows(rowsToData(rows)));
  }

  if (!rows) return <Spinner label="Memuat jam operasional..." />;

  if (!editable) {
    const tersimpan = rows.some((r) => !r.libur);
    return (
      <Card className="card-lift">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Jam Operasional Perpustakaan
          </h2>
        </div>

        {!tersimpan ? (
          <p className="mt-3 text-sm text-slate-500">
            Petugas belum mengatur jam operasional. Cek kembali nanti.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {rows.map((r) => {
              const isToday = r.hari === today;
              return (
                <div
                  key={r.hari}
                  className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl px-2.5 py-1.5 text-sm ${
                    isToday
                      ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-800 ring-1 ring-inset ring-indigo-600/15"
                      : "text-slate-600"
                  }`}
                >
                  <span className="flex min-w-0 flex-wrap items-center gap-2 font-medium">
                    {DAFTAR_HARI.find((d) => d.key === r.hari)?.label}
                    {isToday && !r.libur && (
                      <Badge tone="aktif" className="px-1.5 py-0">Hari ini</Badge>
                    )}
                  </span>
                  {r.libur ? (
                    <Badge tone="ditolak">Libur</Badge>
                  ) : (
                    <span className="whitespace-nowrap font-semibold tabular-nums">
                      {formatJam(r.buka)} – {formatJam(r.tutup)} WIB
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {message?.error && (
          <div className="mt-3">
            <Alert kind="error">{message.error}</Alert>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="card-lift">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Atur Jam Operasional
          </h2>
        </div>
        <Button onClick={handleSave} disabled={saving} className="px-3 py-1.5 text-xs">
          {saving ? "Menyimpan..." : "Simpan Jam"}
        </Button>
      </div>

      {message?.error && (
        <div className="mt-3">
          <Alert kind="error">{message.error}</Alert>
        </div>
      )}
      {message?.success && (
        <div className="mt-3">
          <Alert kind="success">{message.success}</Alert>
        </div>
      )}

      <p className="mt-2 text-xs text-slate-500">
        Jam ini tampil untuk siswa &amp; admin. Centang <b>Libur</b> bila perpustakaan tutup di hari itu.
      </p>

      <div className="mt-3 space-y-1.5">
        {rows.map((r) => (
          <div
            key={r.hari}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2"
          >
            <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={r.libur}
                onChange={(e) =>
                  setRows(rows.map((x) => (x.hari === r.hari ? { ...x, libur: e.target.checked } : x)))
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Libur
            </label>
            <span className="flex-1 text-sm font-semibold text-slate-800">
              {DAFTAR_HARI.find((d) => d.key === r.hari)?.label}
            </span>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <input
                type="time"
                value={r.buka}
                disabled={r.libur}
                onChange={(e) =>
                  setRows(rows.map((x) => (x.hari === r.hari ? { ...x, buka: e.target.value } : x)))
                }
                className="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 disabled:opacity-40 sm:w-auto"
              />
              <span className="text-slate-400">–</span>
              <input
                type="time"
                value={r.tutup}
                disabled={r.libur}
                onChange={(e) =>
                  setRows(rows.map((x) => (x.hari === r.hari ? { ...x, tutup: e.target.value } : x)))
                }
                className="w-24 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 disabled:opacity-40 sm:w-auto"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}