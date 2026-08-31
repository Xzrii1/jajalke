"use client";

import { useCallback, useEffect, useState } from "react";
import { getBukuList, getKategoriList } from "@/app/actions/buku";
import { pinjamBuku } from "@/app/actions/transaksi";
import type { ActionResult, Buku } from "@/lib/types";
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

  async function handlePinjam(b: Buku) {
    setPeminjam(b.id);
    const res = await pinjamBuku(b.id);
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
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900">{b.judul}</h3>
                {b.kategori ? <Badge tone="aktif">{b.kategori}</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {b.penulis ?? "Tanpa penulis"}
                {b.penerbit ? ` · ${b.penerbit}` : ""}
                {b.tahun_terbit ? ` · ${b.tahun_terbit}` : ""}
              </p>
              {b.deskripsi && (
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{b.deskripsi}</p>
              )}
              {b.isbn && <p className="mt-1 text-xs text-slate-400">ISBN {b.isbn}</p>}
              <div className="mt-4 flex items-center justify-between gap-2 pt-3">
                {b.stok > 0 ? (
                  <Badge tone="tersedia">{b.stok} tersedia</Badge>
                ) : (
                  <Badge tone="habis">Stok habis</Badge>
                )}
                <Button
                  variant={b.stok > 0 ? "primary" : "secondary"}
                  onClick={() => handlePinjam(b)}
                  disabled={b.stok <= 0 || peminjam === b.id}
                >
                  {peminjam === b.id ? "Memproses..." : "Pinjam"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}