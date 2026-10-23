# Kalam AI

Web latihan muhadatsah untuk siswa pemula dan menengah. Antarmuka bahasa Indonesia, percakapan bahasa Arab fusha. Proyek Next.js App Router, siap GitHub dan Vercel.

## Fitur

- Empat tema: perkenalan, sekolah, keluarga, dan berbelanja.
- Rekam suara, hentikan, lalu kirim. AI mentranskripsi ucapan, menyusun respons Arab, dan menghasilkan audio.
- Alternatif input teks, pemutar suara, bantuan kosakata, evaluasi berbasis teks, dan unduh transkrip.
- Maksimal 10 giliran per sesi; setiap rekaman maksimal 45 detik dan 3 MB.
- Kunci API hanya berada di server. Production mewajibkan kode akses kelas.

Ini percakapan bergiliran, bukan streaming suara realtime. Tanpa API key, halaman tetap tampil tetapi layanan AI akan menjelaskan bahwa konfigurasi belum lengkap. Tidak ada jawaban AI palsu atau mode simulasi.

## Jalankan di komputer

Pasang Node.js 22 atau lebih baru. Ekstrak ZIP, masuk ke folder yang memuat package.json:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Windows: salin .env.example melalui File Explorer dan ubah nama salinan menjadi .env.local.

Isi .env.local:

```dotenv
OPENAI_API_KEY=isi_kunci_api_anda
CLASS_ACCESS_CODE=buat_kode_kelas_yang_panjang_dan_sulit_ditebak
OPENAI_CHAT_MODEL=gpt-4.1-mini
OPENAI_TRANSCRIBE_MODEL=gpt-4o-mini-transcribe
OPENAI_TTS_MODEL=gpt-4o-mini-tts
```

Buka http://localhost:3000. Jangan menaruh API key di frontend, variabel NEXT_PUBLIC_, atau repositori. Akun API perlu akses model dan kuota berbayar. Langganan ChatGPT tidak menggantikan kuota API.

## Upload ke GitHub

Buat repositori kosong. Upload ISI folder kalam-ai, termasuk package.json, package-lock.json, app, lib, dan .gitignore. Jangan upload ZIP sebagai satu-satunya isi repositori. Jangan upload node_modules, .next, atau .env.local.

Jika memakai Git:

```bash
git init
git add .
git commit -m "Initial Kalam AI app"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

Ganti USERNAME dan NAMA-REPO dengan milik Anda.

## Deploy di Vercel

1. Pilih Add New Project, lalu impor repositori GitHub.
2. Framework: Next.js. Root Directory: folder tempat package.json berada. Jika mengunggah folder pembungkus kalam-ai ke GitHub, pilih folder tersebut sebagai root.
3. Tambahkan OPENAI_API_KEY dan CLASS_ACCESS_CODE pada Environment Variables. Jangan beri awalan NEXT_PUBLIC_. Atur sebagai sensitive jika tersedia.
4. Tambahkan variabel model bila ingin mengganti model default.
5. Deploy. Jika mengubah environment variable setelah deployment, lakukan redeploy.
6. Buka URL HTTPS, masukkan kode kelas, centang persetujuan, lalu izinkan mikrofon.

Biarkan build command dan output directory mengikuti pengaturan Next.js bawaan Vercel. Tidak membutuhkan database atau vercel.json.

## Cara memakai

Pilih tema dan tingkat. Masukkan kode kelas dari pengelola. Setujui pengiriman data, lalu tekan Mulai bicara. Setelah selesai, tekan Hentikan & kirim. Dengarkan respons AI atau baca teksnya. Browser dapat memblokir pemutaran otomatis; tekan Play pada pemutar audio jika perlu. Sesudah beberapa giliran, pilih Evaluasi latihan. Unduh teks sebelum memulai sesi baru atau mengganti tema.

Halaman tidak menyimpan riwayat secara permanen. Refresh menutup sesi. Pilihan tema dan tingkat memulai sesi baru. Pembukaan tema berupa teks; audio tersedia untuk respons setelah siswa mengirim ucapan atau teks.

## Data, biaya, dan penggunaan kelas

Audio dikirim melalui server aplikasi ke OpenAI untuk transkripsi. Model percakapan menerima teks riwayat; model suara menerima jawaban AI. Aplikasi tidak menyimpan audio atau riwayat dalam database. Penyedia API tetap memproses data sesuai kebijakan layanan; pengelola perlu menjelaskan hal ini kepada sekolah dan peserta. Untuk anak, sesuaikan persetujuan dengan kebijakan sekolah dan wali.

Gunakan kode kelas yang kuat dan ubah secara berkala. Kode kelas merupakan perlindungan dasar uji coba, bukan sistem login individu. Proyek belum memiliki pembatasan laju lintas server, kuota per siswa, atau pengelolaan akun. Sebelum membagikan ke publik luas, tambahkan autentikasi, rate limiting berbasis penyimpanan bersama, dan kuota penggunaan. Batas giliran pada antarmuka bukan pengaman biaya yang kuat. Atur pemantauan biaya di akun API dan jangan membagikan kode akses di repositori.

Umpan balik hanya meninjau transkrip, bukan ketepatan pelafalan. Transkripsi dapat keliru. Guru perlu memeriksa koreksi AI. Jangan menggunakan umpan balik sebagai nilai resmi atau bukti bahwa kemampuan siswa telah meningkat. Untuk penelitian, gunakan rubrik berbicara dan pengukuran sebelum serta sesudah penggunaan.

## Penanganan masalah

- Mikrofon tidak tersedia: gunakan HTTPS atau localhost, periksa izin browser, atau gunakan teks.
- Kode kelas salah: sesuaikan dengan CLASS_ACCESS_CODE pada server.
- API belum terpasang: periksa environment variable lalu redeploy.
- Respons AI gagal: periksa saldo/kuota, akses model, status penyedia API, dan log server Vercel. Jangan membagikan kunci API saat meminta bantuan.
- Audio gagal tetapi teks muncul: lanjutkan melalui teks lalu coba pada giliran berikutnya.
- Rekaman besar: buat ucapan lebih pendek dari 45 detik.
- Model berubah: ubah variabel OPENAI_CHAT_MODEL, OPENAI_TRANSCRIBE_MODEL, dan OPENAI_TTS_MODEL sesuai model yang tersedia di akun. Periksa masa dukung model pada dokumentasi resmi.

## Pemeriksaan

```bash
npm test
npm run build
```

Uji langsung memerlukan API key dan mikrofon: coba seluruh tema, kirim suara dan teks, minta evaluasi, unduh hasil, tolak izin mikrofon, coba kode kelas salah, serta periksa tampilan ponsel. Integrasi API langsung tidak dapat diverifikasi tanpa kredensial pemilik.

## Struktur

- app/page.js: antarmuka dan perekaman browser.
- app/globals.css: gaya responsif.
- app/api/practice/route.js: validasi, akses kelas, transkripsi, percakapan, dan sintesis suara.
- lib/settings.mjs: tema dan validasi riwayat.
- tests/history.test.mjs: pemeriksaan validasi riwayat.

## Dokumentasi

- https://nextjs.org/docs/app
- https://vercel.com/docs/environment-variables
- https://developers.openai.com/api/docs/guides/speech-to-text
- https://developers.openai.com/api/docs/guides/text-to-speech

Lisensi MIT. Sesuaikan nama aplikasi, materi, dan pedoman kelas dengan kebutuhan.
