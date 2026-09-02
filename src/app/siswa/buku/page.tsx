"use client";

import { useCallback, useEffect, useState } from "react";
import { getBukuList, getKategoriList } from "@/app/actions/buku";
import { pinjamBuku } from "@/app/actions/transaksi";
import { getRatingInfo } from "@/app/actions/ulasan";
import { BookRating } from "@/components/book-rating";
import { KONDISI_LABELS, KONDISI_TONES } from "@/lib/kondisi";
import type { ActionResult, Buku, BukuRating } from "@/lib/types";
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  Spinner,
} from "@/components/ui";

export default function SiswaBuku() {
  const [buku, setBuku] = useState<Buku[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<ActionResult | null>(null);
  const [peminjam, setPeminjam] = useState<string | null>(null);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const [ratings, setRatings] = useState<Record<string, BukuRating>>({});
  const fetchList = useCallback(
    () => getBukuList({ search, kategori: kategoriFilter || undefined }),
    [search, kategoriFilter]
  );

  useEffect(() => {
    let cancelled = false;
    fetchList().then((res) => {
      if (cancelled) return;
      setBuku(res.data);
      if (res.error) setError(res.error);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [fetchList]);

  useEffect(() => {
    if (buku.length === 0) return;
    let cancelled = false;
    getRatingInfo(buku.map((b) => b.id)).then((res) => {
      if (cancelled) return;
      if (res.data) setRatings(res.data);
      if (res.error) setError(res.error);
    });
    return () => {
      cancelled = true;
    };
  }, [buku]);

  const refreshRatings = useCallback(async () => {
    const res = await getRatingInfo(buku.map((b) => b.id));
    if (res.data) setRatings(res.data);
    if (res.error) setError(res.error);
  }, [buku]);

  const refresh = useCallback(async () => {
    const res = await fetchList();
    setBuku(res.data);
    if (res.error) setError(res.error);
  }, [fetchList]);

  useEffect(() => {
    getKategoriList().then(setKategoriOptions);
  }, []);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 6000);
      return () => clearTimeout(t);
    }
  }, [message]);

  async function handlePinjam(b: Buku, durasi: number) {
    setPeminjam(b.id);
    const res = await pinjamBuku(b.id, durasi);
    setMessage(res);
    setPeminjam(null);
    await refresh();
  }

  return (
    <div className="anim-rise space-y-5">
      <div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-3xl">Cari &amp; Pinjam Buku</h1>
        <p className="mt-1 text-sm text-slate-500">
          Temukan buku perpustakaan berdasarkan judul, penulis, kategori, atau ISBN.
        </p>
      </div>

      {message?.error && <Alert kind="error">{message.error}</Alert>}
      {message?.success && <Alert kind="success">{message.success}</Alert>}
      {error && <Alert kind="info">{error}</Alert>}

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              placeholder="Cari judul, penulis, kategori, atau ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="sm:w-56">
            <Select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {kategoriOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </Select>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setSearch("");
              setKategoriFilter("");
            }}
          >
            Reset
          </Button>
        </div>
      </Card>

      {loading ? (
        <Spinner label="Memuat daftar buku..." />
      ) : buku.length === 0 ? (
        <Card>
          <EmptyState
            title="Buku tidak ditemukan"
            description="Coba ubah kata kunci pencarian atau filter kategori."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buku.map((b, i) => (
            <Card
              key={b.id}
              className="anim-rise card-lift flex flex-col"
              style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
            >
              <div className="flex gap-4">
                <div className="shrink-0">
                  {b.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.cover_url}
                      alt={b.judul}
                      className="h-32 w-24 rounded-xl border border-slate-200 object-cover shadow-sm"
                    />
                  ) : (
                    <span className="flex h-32 w-24 flex-col items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A1.5 1.5 0 0021.75 19.5V4.5A1.5 1.5 0 0020.25 3H3.75A1.5 1.5 0 002.25 4.5v15A1.5 1.5 0 003.75 21z" />
                      </svg>
                      <span className="text-[10px]">Tanpa sampul</span>
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">{b.judul}</h3>
                  </div>
                  {b.kategori ? <Badge tone="aktif" className="mt-1 w-fit">{b.kategori}</Badge> : null}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge tone={KONDISI_TONES[b.kondisi ?? "baik"]} className="w-fit">
                      {KONDISI_LABELS[b.kondisi ?? "baik"]}
                    </Badge>
                    <span className="text-xs text-slate-400">kondisi buku</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {b.penulis ?? "Tanpa penulis"}
                    {b.penerbit ? ` · ${b.penerbit}` : ""}
                    {b.tahun_terbit ? ` · ${b.tahun_terbit}` : ""}
                  </p>
                  {b.deskripsi && (
                    <p className="mt-1 line-clamp-3 text-sm text-slate-600">{b.deskripsi}</p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <BookRating
                  bukuId={b.id}
                  rating={ratings[b.id]}
                  onChanged={refreshRatings}
                />
              </div>
              {b.isbn && <p className="mt-3 text-xs text-slate-400">ISBN {b.isbn}</p>}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                {b.stok > 0 ? (
                  <Badge tone="tersedia">{b.stok} tersedia</Badge>
                ) : (
                  <Badge tone="habis">Stok habis</Badge>
                )}
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={durations[b.id] ?? 7}
                      disabled={b.stok <= 0}
                      className="w-16 px-2 py-1.5 text-center text-sm"
                      onChange={(e) =>
                        setDurations((d) => ({ ...d, [b.id]: Number(e.target.value) }))
                      }
                    />
                    <span>hari</span>
                  </label>
                  <Button
                    variant={b.stok > 0 ? "primary" : "secondary"}
                    onClick={() => handlePinjam(b, durations[b.id] ?? 7)}
                    disabled={b.stok <= 0 || peminjam === b.id}
                  >
                    {peminjam === b.id ? "Mengajukan..." : "Ajukan"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}