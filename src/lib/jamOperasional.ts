export type HariKey =
  | "senin"
  | "selasa"
  | "rabu"
  | "kamis"
  | "jumat"
  | "sabtu"
  | "minggu";

export interface HariJam {
  buka: string;
  tutup: string;
}

/** Objek jam operasional per hari. Hari yang libur tidak ada kunci/hilang. */
export type JamOperasional = Partial<Record<HariKey, HariJam>>;

export const DAFTAR_HARI: { key: HariKey; label: string }[] = [
  { key: "senin", label: "Senin" },
  { key: "selasa", label: "Selasa" },
  { key: "rabu", label: "Rabu" },
  { key: "kamis", label: "Kamis" },
  { key: "jumat", label: "Jumat" },
  { key: "sabtu", label: "Sabtu" },
  { key: "minggu", label: "Minggu" },
];

/** Jam yang dipakai bila petugas belum menyimpan pengaturan. */
export const DEFAULT_JAM_OPERASIONAL: JamOperasional = {
  senin: { buka: "08:00", tutup: "16:00" },
  selasa: { buka: "08:00", tutup: "16:00" },
  rabu: { buka: "08:00", tutup: "16:00" },
  kamis: { buka: "08:00", tutup: "16:00" },
  jumat: { buka: "08:00", tutup: "16:00" },
  sabtu: { buka: "08:00", tutup: "12:00" },
};

/** Kunci hari (selasa, dll.) -> label bahasa Indonesia. */
export const HARI_LABEL: Record<HariKey, string> = Object.fromEntries(
  DAFTAR_HARI.map((h) => [h.key, h.label])
) as Record<HariKey, string>;

/** Hari ini dalam ekivalen HariKey, berdasarkan zona waktu Asia/Jakarta. */
export function todayHariKey(): HariKey | null {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
  }).format(new Date());
  const map: Record<string, HariKey> = {
    Monday: "senin",
    Tuesday: "selasa",
    Wednesday: "rabu",
    Thursday: "kamis",
    Friday: "jumat",
    Saturday: "sabtu",
    Sunday: "minggu",
  };
  return map[name] ?? null;
}