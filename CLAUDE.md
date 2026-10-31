# Konteks repo (untuk asisten AI)

- Video **"Menuju Akhir Zaman"** — alur akhir zaman menurut Al-Qur'an & hadis sahih, ditutup renungan tentang zaman teknologi/AI. Diminta Yayan (Septian Anugrah Dwi Putra). Mesin disalin dari `video-fisika-atom`. Aturan umum & pelajaran teknis: repo `septiananugrah-ship-it/science-intro` → `CLAUDE.md`.
- **Aturan isi (wajib):** dalil dan renungan dipisah jelas; setiap dalil diberi pil sumber (QS/HR) sesuai `naskah/AUDIT.md`; adegan renungan diberi label "Renungan · bukan tafsir"; tidak memastikan "AI = Dajjal/Yakjuj Makjuj"; urutan tanda besar disebut diperselisihkan ulama; penutup *wallahu a'lam*.
- **Aturan visual (wajib):** tidak menggambar wajah/sosok nabi, Nabi Isa, Imam Mahdi, malaikat, Dajjal, Yakjuj Makjuj, Dzulqarnain — semuanya simbol (cahaya, menara, gerbang, peta, garis waktu, siluet jauh tanpa wajah untuk manusia umum). Tanpa tulisan Arab (font tidak tersedia); nama surah ditulis Latin.
- Gaya: **"Gulungan Malam"** — langit malam biru tinta pekat dengan bintang, aksen emas lembut seperti iluminasi naskah, pola geometris Islami tipis (bintang delapan) di latar, garis waktu emas; warna: dalil/wahyu = emas `C.gold`, tanda kecil = jingga `C.kin`, tanda besar = merah `C.heat`, fitnah/ilusi = ungu `C.spr`, iman/cahaya = toska `C.cyan`, kehidupan/bibit = hijau `C.work`. Font & komponen sama dengan seri fisika (`primitives.tsx`: Formula/Card/Label/Ripple/Motes/Spark…).
- **Semua adegan harus terus bergerak** — `naskah/POLISH.md`. Grafik boleh sederhana, yang penting alur jelas.
- **Claude tidak menjalankan workflow GitHub Actions.** Setelah merge ke `main`, minta pengguna menekan *Run workflow*.
- Narasi menyusul. Selalu sediakan versi tanpa narasi.

## Tata letak
- Kartu utama ≥ 56 px, satu kartu per momen; zona subtitle (bawah 180 px) bebas; margin ≥ 80 px. Komponen HTML di luar `<Stage>`.
- Kemulusan: `EASE` lembut, fade keluar `EASE_IN_OUT`; tanpa ganti berdasarkan ambang; tanpa CSS blur; tanpa filter pada garis lurus.

## QA
- `CHROME_PATH=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell node scripts/qa-lines.mjs out/x <adegan...>` lalu `python3 scripts/contact.py out/x out/x-s 6`.
- Uji kemulusan: `node scripts/qa-film.mjs out/a.mp4 0 99999 0.25` lalu `python3 scripts/qa-glitch.py out/a.mp4 0`.
