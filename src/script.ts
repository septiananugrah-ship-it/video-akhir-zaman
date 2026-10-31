// Naskah narasi "Menuju Akhir Zaman" — alur akhir zaman menurut Al-Qur'an & hadis, dengan renungan.
// Setiap adegan berisi baris narasi. Durasi baris dihitung otomatis dari jumlah
// suku kata (lihat timeline.ts) atau dari rekaman suara bila sudah ada,
// jadi cukup ubah teks di sini: visual, subtitle, dan musik ikut menyesuaikan.
//
// Aturan menulis teks narasi (dibaca mesin TTS):
//  - angka & simbol ditulis sebagai kata ("dua puluh meter per detik"),
//  - rumus ditulis sebagai kalimat; rumus rapi tampil di layar (komponen Formula).
// Angka sudah dicek di naskah/AUDIT.md (g = 10 m/s², ρ air = 1000 kg/m³, p_atm = 100 kPa, kecuali disebut lain).
//
// hl     : kata/frasa yang disorot pada subtitle
// pause  : jeda (detik) SETELAH baris dibacakan
// lead   : jeda (detik) sebelum baris pertama adegan
// tail   : jeda (detik) setelah baris terakhir adegan
// fixed  : durasi tetap (detik) untuk adegan tanpa narasi

export type Line = {
  text: string;
  /** Teks khusus TTS (opsional). Bila kosong, dibuat otomatis oleh src/tts.ts. */
  tts?: string;
  hl?: string[];
  pause?: number;
};

export type SceneScript = {
  id: string;
  chapter: string; // nomor bab di heading, "" untuk tanpa heading
  part?: 1 | 2 | 3 | 4; // 1 awal kisah, 2 tanda kecil, 3 tanda besar, 4 renungan
  title: string;
  lines: Line[];
  lead?: number;
  tail?: number;
  fixed?: number;
  mood: 'mystery' | 'title' | 'wonder' | 'build' | 'tension' | 'bright' | 'resolve' | 'outro';
};

export const SCRIPT: SceneScript[] = [
  {
    "id": "hook",
    "chapter": "",
    "title": "Dunia yang berlari",
    "mood": "mystery",
    "lead": 1.6,
    "tail": 1.2,
    "lines": [
      {
        "text": "Seratus tahun lalu, kabar dari kota sebelah butuh berhari-hari untuk sampai. Hari ini, satu video bisa ditonton satu miliar orang dalam semalam.",
        "hl": [
          "satu miliar orang"
        ],
        "pause": 0.7
      },
      {
        "text": "Gedung-gedung berlomba menembus awan. Mesin mulai bisa menulis, menggambar, dan berbicara seperti manusia.",
        "hl": [
          "seperti manusia"
        ],
        "pause": 0.7
      },
      {
        "text": "Banyak orang bertanya: ke mana semua ini menuju?",
        "hl": [
          "ke mana semua ini menuju"
        ],
        "pause": 0.8
      },
      {
        "text": "Empat belas abad yang lalu, Al-Qur'an dan sabda Nabi Muhammad sudah menggambarkan sebuah alur: dari awal manusia, sampai akhir dunia.",
        "hl": [
          "sebuah alur"
        ],
        "pause": 0.7
      },
      {
        "text": "Video ini mencoba menyusun alur itu, lalu merenungkannya dengan akal, di tengah zaman yang berubah sangat cepat.",
        "hl": [
          "merenungkannya dengan akal"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "title",
    "chapter": "",
    "title": "Menuju Akhir Zaman",
    "mood": "title",
    "fixed": 8,
    "lines": []
  },
  {
    "id": "roadmap",
    "chapter": "",
    "title": "Peta video dan cara membaca",
    "mood": "wonder",
    "lead": 0.8,
    "tail": 1.4,
    "lines": [
      {
        "text": "Sebelum mulai, satu hal penting tentang cara membaca video ini.",
        "hl": [
          "cara membaca"
        ],
        "pause": 0.7
      },
      {
        "text": "Bagian yang bersumber dari Al-Qur'an dan hadis sahih akan diberi tanda sumbernya.",
        "hl": [
          "diberi tanda sumbernya"
        ],
        "pause": 0.7
      },
      {
        "text": "Bagian renungan, termasuk soal teknologi dan kecerdasan buatan, ditandai jelas sebagai pemikiran, bukan tafsir dan bukan kepastian.",
        "hl": [
          "bukan tafsir"
        ],
        "pause": 0.7
      },
      {
        "text": "Video ini tidak menggambarkan wajah para nabi maupun sosok-sosok gaib. Semuanya ditampilkan sebagai simbol.",
        "hl": [
          "simbol"
        ],
        "pause": 0.7
      },
      {
        "text": "Alurnya empat bagian: awal kisah manusia, tanda-tanda kecil, tanda-tanda besar, lalu renungan untuk zaman kita.",
        "hl": [
          "empat bagian"
        ],
        "pause": 0.7
      },
      {
        "text": "Dan untuk perkara yang sebenarnya, rujukan utamanya tetap para ulama. Hanya Allah yang paling mengetahui.",
        "hl": [
          "Hanya Allah yang paling mengetahui"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "amanah",
    "chapter": "01",
    "title": "Awal kisah: khalifah dan amanah",
    "mood": "wonder",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Kisah ini dimulai sebelum manusia ada. Allah berfirman kepada para malaikat: Aku hendak menjadikan khalifah di bumi.",
        "hl": [
          "khalifah di bumi"
        ],
        "pause": 0.7
      },
      {
        "text": "Para malaikat bertanya, apakah Engkau akan menjadikan di sana makhluk yang berbuat kerusakan dan menumpahkan darah? Allah menjawab: Aku mengetahui apa yang tidak kamu ketahui. Itu dalam surah Al-Baqarah ayat tiga puluh.",
        "hl": [
          "Al-Baqarah ayat tiga puluh"
        ],
        "pause": 0.7
      },
      {
        "text": "Lalu amanah ditawarkan kepada langit, bumi, dan gunung-gunung. Semuanya enggan memikulnya. Manusialah yang memikulnya. Surah Al-Ahzab ayat tujuh puluh dua.",
        "hl": [
          "amanah"
        ],
        "pause": 0.7
      },
      {
        "text": "Amanah itu adalah kebebasan memilih, beserta tanggung jawab atas pilihan itu.",
        "hl": [
          "kebebasan memilih"
        ],
        "pause": 0.7
      },
      {
        "text": "Sejak saat itu, sejarah manusia adalah kisah tentang bagaimana amanah itu dijaga, atau disia-siakan.",
        "hl": [
          "dijaga, atau disia-siakan"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "prophets",
    "chapter": "02",
    "title": "Rantai para nabi",
    "mood": "build",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Allah tidak membiarkan manusia tanpa petunjuk. Dari Nabi Adam, Nuh, Ibrahim, Musa, Isa, utusan datang silih berganti.",
        "hl": [
          "utusan datang silih berganti"
        ],
        "pause": 0.7
      },
      {
        "text": "Setiap kali manusia menyimpang, seorang nabi datang meluruskan. Pesannya sama: sembahlah Allah, dan jauhi thaghut. Surah An-Nahl ayat tiga puluh enam.",
        "hl": [
          "pesannya sama"
        ],
        "pause": 0.7
      },
      {
        "text": "Banyak kaum mendustakan, lalu dibinasakan: kaum Nuh dengan banjir, kaum 'Ad dengan angin, kaum Tsamud dengan suara keras yang menggelegar.",
        "hl": [
          "dibinasakan"
        ],
        "pause": 0.7
      },
      {
        "text": "Polanya berulang: kemakmuran, kesombongan, peringatan, lalu kehancuran. Al-Qur'an menceritakannya agar manusia mengambil pelajaran.",
        "hl": [
          "Polanya berulang"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "lastprophet",
    "chapter": "03",
    "title": "Nabi terakhir dan dua jari",
    "mood": "wonder",
    "part": 1,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Rantai itu berakhir pada Nabi Muhammad, penutup para nabi. Surah Al-Ahzab ayat empat puluh.",
        "hl": [
          "penutup para nabi"
        ],
        "pause": 0.7
      },
      {
        "text": "Beliau mengangkat jari telunjuk dan jari tengahnya, lalu bersabda: aku diutus, dan hari kiamat, seperti dua jari ini. Hadis riwayat Bukhari dan Muslim.",
        "hl": [
          "seperti dua jari ini"
        ],
        "pause": 0.7
      },
      {
        "text": "Artinya, dengan diutusnya nabi terakhir, umat manusia sudah memasuki babak terakhir sejarahnya.",
        "hl": [
          "babak terakhir"
        ],
        "pause": 0.7
      },
      {
        "text": "Al-Qur'an pun berkata: telah dekat datangnya hari kiamat. Surah Al-Qamar ayat satu.",
        "hl": [
          "telah dekat"
        ],
        "pause": 0.7
      },
      {
        "text": "Dekat menurut ukuran Allah, bukan ukuran umur kita. Kapan tepatnya, hanya Allah yang tahu. Surah Al-A'raf ayat seratus delapan puluh tujuh.",
        "hl": [
          "hanya Allah yang tahu"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "jibril",
    "chapter": "04",
    "title": "Hadis Jibril: bangunan yang menjulang",
    "mood": "build",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Suatu hari, Malaikat Jibril datang dalam rupa seorang laki-laki dan bertanya kepada Nabi tentang tanda-tanda kiamat.",
        "hl": [
          "tanda-tanda kiamat"
        ],
        "pause": 0.7
      },
      {
        "text": "Nabi menjawab: bila budak perempuan melahirkan tuannya.",
        "hl": [
          "melahirkan tuannya"
        ],
        "pause": 0.7
      },
      {
        "text": "Dan bila engkau melihat orang-orang yang dulu tak beralas kaki, tak berpakaian, miskin, para penggembala kambing, berlomba-lomba meninggikan bangunan. Hadis riwayat Muslim.",
        "hl": [
          "berlomba-lomba meninggikan bangunan"
        ],
        "pause": 0.7
      },
      {
        "text": "Empat belas abad lalu, gurun Arab hanyalah tenda dan kambing. Hari ini, gedung tertinggi di dunia berdiri di sana, lebih dari delapan ratus meter.",
        "hl": [
          "lebih dari delapan ratus meter"
        ],
        "pause": 0.7
      },
      {
        "text": "Para ulama menjelaskan makna tanda ini: perubahan sosial yang drastis, ketika orang yang dulu sederhana tiba-tiba hidup dalam kemewahan dan berbangga dengannya.",
        "hl": [
          "perubahan sosial yang drastis"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "knowledge",
    "chapter": "05",
    "title": "Ilmu diangkat, waktu dipercepat",
    "mood": "build",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Nabi bersabda: tidak akan terjadi kiamat sampai ilmu dicabut, gempa banyak terjadi, zaman saling berdekatan, fitnah bermunculan, dan banyak terjadi pembunuhan. Hadis riwayat Bukhari.",
        "hl": [
          "zaman saling berdekatan"
        ],
        "pause": 0.7
      },
      {
        "text": "Ilmu yang dicabut, menurut hadis lain, terjadi dengan wafatnya para ulama, lalu manusia mengangkat pemimpin yang bodoh, yang berfatwa tanpa ilmu.",
        "hl": [
          "wafatnya para ulama"
        ],
        "pause": 0.7
      },
      {
        "text": "Zaman saling berdekatan dipahami sebagian ulama sebagai waktu yang terasa makin cepat dan berkahnya hilang. Setahun terasa seperti sebulan.",
        "hl": [
          "waktu yang terasa makin cepat"
        ],
        "pause": 0.7
      },
      {
        "text": "Ada yang juga memahaminya sebagai jarak yang makin dekat. Perjalanan sebulan kini cukup beberapa jam, dan kabar dari ujung dunia tiba dalam sekejap.",
        "hl": [
          "jarak yang makin dekat"
        ],
        "pause": 0.7
      },
      {
        "text": "Kedua makna itu terasa sangat akrab bagi kita hari ini.",
        "hl": [
          "sangat akrab"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "trust",
    "chapter": "06",
    "title": "Amanah yang disia-siakan",
    "mood": "build",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Seseorang bertanya kepada Nabi: kapan kiamat? Nabi menjawab: apabila amanah disia-siakan, maka tunggulah kiamat.",
        "hl": [
          "amanah disia-siakan"
        ],
        "pause": 0.7
      },
      {
        "text": "Bagaimana amanah disia-siakan? Beliau menjawab: apabila urusan diserahkan kepada orang yang bukan ahlinya. Hadis riwayat Bukhari.",
        "hl": [
          "bukan ahlinya"
        ],
        "pause": 0.7
      },
      {
        "text": "Ingat amanah di awal kisah tadi. Akhir sejarah ternyata juga diukur dengan amanah yang sama.",
        "hl": [
          "amanah yang sama"
        ],
        "pause": 0.7
      },
      {
        "text": "Hadis lain menyebut tanda-tanda berikutnya: merebaknya kebodohan, diminumnya khamar, dan tampaknya perzinaan secara terang-terangan. Hadis riwayat Bukhari.",
        "hl": [
          "secara terang-terangan"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "today",
    "chapter": "07",
    "title": "Renungan: tanda kecil di sekitar kita",
    "mood": "wonder",
    "part": 2,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Bagian ini adalah renungan, bukan tafsir.",
        "hl": [
          "renungan, bukan tafsir"
        ],
        "pause": 0.7
      },
      {
        "text": "Banyak ulama berpendapat sebagian besar tanda kecil sudah terjadi, dan sebagian sedang terjadi di depan mata kita.",
        "hl": [
          "sedang terjadi"
        ],
        "pause": 0.7
      },
      {
        "text": "Informasi melimpah, tetapi kebijaksanaan terasa langka. Siapa pun bisa berbicara tentang agama tanpa ilmu, dan didengar jutaan orang.",
        "hl": [
          "kebijaksanaan terasa langka"
        ],
        "pause": 0.7
      },
      {
        "text": "Hari-hari berlalu tanpa terasa. Kita menggulir layar berjam-jam, lalu heran ke mana waktu pergi.",
        "hl": [
          "ke mana waktu pergi"
        ],
        "pause": 0.7
      },
      {
        "text": "Tanda-tanda ini bukan untuk ditakuti, melainkan pengingat: dua jari itu sudah sangat dekat.",
        "hl": [
          "pengingat"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "tenSigns",
    "chapter": "08",
    "title": "Sepuluh tanda besar",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Setelah tanda-tanda kecil, akan datang tanda-tanda besar. Tanda ini luar biasa, dan bila sudah terjadi, susul-menyusul seperti manik-manik dari untaian yang terputus.",
        "hl": [
          "seperti manik-manik"
        ],
        "pause": 0.7
      },
      {
        "text": "Nabi bersabda: kalian tidak akan melihat kiamat sebelum melihat sepuluh tanda. Hadis riwayat Muslim dari Hudzaifah bin Asid.",
        "hl": [
          "sepuluh tanda"
        ],
        "pause": 0.7
      },
      {
        "text": "Asap, Dajjal, binatang melata, terbitnya matahari dari barat, turunnya Isa putra Maryam, dan Yakjuj Makjuj.",
        "hl": [
          "Dajjal",
          "Yakjuj Makjuj"
        ],
        "pause": 0.7
      },
      {
        "text": "Tiga kali amblesnya bumi: di timur, di barat, dan di Jazirah Arab. Dan yang terakhir, api yang keluar dari Yaman, menggiring manusia ke tempat berkumpulnya.",
        "hl": [
          "api yang keluar dari Yaman"
        ],
        "pause": 0.7
      },
      {
        "text": "Urutan pastinya diperselisihkan para ulama. Yang disusun di video ini adalah salah satu urutan yang banyak dipegang.",
        "hl": [
          "diperselisihkan para ulama"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "mahdi",
    "chapter": "09",
    "title": "Imam Mahdi",
    "mood": "build",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Sebelum Dajjal muncul, banyak hadis menyebut datangnya seorang pemimpin dari keturunan Nabi: Al-Mahdi.",
        "hl": [
          "Al-Mahdi"
        ],
        "pause": 0.7
      },
      {
        "text": "Nabi bersabda: dunia tidak akan berakhir sampai seorang laki-laki dari keluargaku, yang namanya seperti namaku, memimpin bangsa Arab. Hadis riwayat Abu Dawud dan Tirmidzi.",
        "hl": [
          "namanya seperti namaku"
        ],
        "pause": 0.7
      },
      {
        "text": "Ia akan memenuhi bumi dengan keadilan, setelah sebelumnya dipenuhi kezaliman.",
        "hl": [
          "dengan keadilan"
        ],
        "pause": 0.7
      },
      {
        "text": "Sepanjang sejarah, banyak orang mengaku sebagai Mahdi. Para ulama mengingatkan: Mahdi tidak dikenal karena pengakuannya, dan umat tidak diperintah untuk mencari-carinya.",
        "hl": [
          "tidak dikenal karena pengakuannya"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "dajjal",
    "chapter": "10",
    "title": "Dajjal: fitnah terbesar",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Nabi bersabda: sejak Adam diciptakan sampai hari kiamat, tidak ada fitnah yang lebih besar daripada Dajjal. Hadis riwayat Muslim.",
        "hl": [
          "tidak ada fitnah yang lebih besar"
        ],
        "pause": 0.7
      },
      {
        "text": "Setiap nabi memperingatkan umatnya tentang Dajjal. Ia buta sebelah, sedangkan Tuhan kalian tidak buta sebelah. Di antara kedua matanya tertulis kafir, yang bisa dibaca setiap mukmin. Hadis riwayat Bukhari.",
        "hl": [
          "buta sebelah"
        ],
        "pause": 0.7
      },
      {
        "text": "Ia datang dengan sesuatu yang tampak seperti surga dan neraka. Tetapi yang ia sebut surga sebenarnya neraka, dan yang ia sebut neraka sebenarnya surga.",
        "hl": [
          "seperti surga dan neraka"
        ],
        "pause": 0.7
      },
      {
        "text": "Inilah inti fitnahnya: yang tampak di mata berlawanan dengan kenyataan.",
        "hl": [
          "berlawanan dengan kenyataan"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "dajjal40",
    "chapter": "11",
    "title": "Empat puluh hari",
    "mood": "build",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Para sahabat bertanya: berapa lama ia tinggal di bumi? Nabi menjawab: empat puluh hari.",
        "hl": [
          "empat puluh hari"
        ],
        "pause": 0.7
      },
      {
        "text": "Satu hari seperti setahun, satu hari seperti sebulan, satu hari seperti sepekan, dan hari-hari lainnya seperti hari kalian. Hadis riwayat Muslim dari An-Nawwas bin Sam'an.",
        "hl": [
          "satu hari seperti setahun"
        ],
        "pause": 0.7
      },
      {
        "text": "Ia memerintahkan langit, lalu hujan turun. Ia memerintahkan bumi, lalu tumbuhan keluar. Ia melewati reruntuhan, dan harta karun mengikutinya.",
        "hl": [
          "hujan turun"
        ],
        "pause": 0.7
      },
      {
        "text": "Ia bergerak secepat hujan yang dihembus angin, dan mendatangi hampir seluruh negeri, kecuali Makkah dan Madinah, yang dijaga para malaikat.",
        "hl": [
          "kecuali Makkah dan Madinah"
        ],
        "pause": 0.7
      },
      {
        "text": "Orang yang bertemu dengannya, kata Nabi, hendaklah membacakan kepadanya ayat-ayat pembuka surah Al-Kahfi.",
        "hl": [
          "surah Al-Kahfi"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "isa",
    "chapter": "12",
    "title": "Turunnya Nabi Isa",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Lalu Allah menurunkan Isa putra Maryam, di menara putih di sebelah timur Damaskus, dengan kedua tangannya bertumpu pada sayap dua malaikat.",
        "hl": [
          "menara putih"
        ],
        "pause": 0.7
      },
      {
        "text": "Isa mengejar Dajjal, dan membunuhnya di gerbang Lud. Fitnah terbesar dalam sejarah manusia pun berakhir.",
        "hl": [
          "gerbang Lud"
        ],
        "pause": 0.7
      },
      {
        "text": "Isa memimpin dengan syariat Nabi Muhammad. Ia mematahkan salib, membunuh babi, dan menghapus jizyah. Harta melimpah sampai tak ada yang mau menerimanya. Hadis riwayat Bukhari dan Muslim.",
        "hl": [
          "Harta melimpah"
        ],
        "pause": 0.7
      },
      {
        "text": "Tetapi kedamaian itu belum akhir cerita.",
        "hl": [
          "belum akhir cerita"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "yajuj",
    "chapter": "13",
    "title": "Yakjuj dan Makjuj dalam Al-Qur'an",
    "mood": "build",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Al-Qur'an menceritakan Dzulqarnain, raja yang berkelana ke timur dan barat.",
        "hl": [
          "Dzulqarnain"
        ],
        "pause": 0.7
      },
      {
        "text": "Di antara dua gunung, ia menemui suatu kaum yang mengeluh: sesungguhnya Yakjuj dan Makjuj berbuat kerusakan di bumi.",
        "hl": [
          "berbuat kerusakan"
        ],
        "pause": 0.7
      },
      {
        "text": "Dzulqarnain membangun dinding dari potongan besi, lalu menuangkan tembaga cair di atasnya. Yakjuj dan Makjuj tidak mampu mendaki maupun melubanginya.",
        "hl": [
          "tembaga cair"
        ],
        "pause": 0.7
      },
      {
        "text": "Ia berkata: ini rahmat dari Tuhanku. Apabila janji Tuhanku telah datang, Dia akan menjadikannya hancur rata. Surah Al-Kahfi ayat sembilan puluh empat sampai sembilan puluh delapan.",
        "hl": [
          "hancur rata"
        ],
        "pause": 0.7
      },
      {
        "text": "Dan dalam surah Al-Anbiya ayat sembilan puluh enam: hingga apabila Yakjuj dan Makjuj dilepaskan, mereka turun dengan cepat dari setiap tempat yang tinggi.",
        "hl": [
          "dari setiap tempat yang tinggi"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "yajujEnd",
    "chapter": "14",
    "title": "Kesombongan terakhir",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Hadis riwayat Muslim melanjutkan kisahnya. Allah mewahyukan kepada Isa: Aku telah mengeluarkan hamba-hamba-Ku yang tak seorang pun mampu memerangi mereka.",
        "hl": [
          "tak seorang pun mampu memerangi mereka"
        ],
        "pause": 0.7
      },
      {
        "text": "Isa membawa orang-orang beriman berlindung ke Gunung Thur.",
        "hl": [
          "Gunung Thur"
        ],
        "pause": 0.7
      },
      {
        "text": "Yakjuj dan Makjuj menyebar. Rombongan pertama melewati danau Thabariyah dan meminum airnya, sampai rombongan terakhir berkata: dulu di sini pernah ada air.",
        "hl": [
          "dulu di sini pernah ada air"
        ],
        "pause": 0.7
      },
      {
        "text": "Mereka berkata: kita telah membunuh penduduk bumi, mari kita bunuh penduduk langit. Mereka melepaskan anak panah ke langit, dan anak panah itu kembali berlumuran seperti darah.",
        "hl": [
          "penduduk langit"
        ],
        "pause": 0.7
      },
      {
        "text": "Isa dan para sahabatnya berdoa. Lalu Allah mengirim ulat-ulat kecil di leher mereka, dan mereka semua mati seketika, seperti satu jiwa.",
        "hl": [
          "ulat-ulat kecil"
        ],
        "pause": 0.7
      },
      {
        "text": "Kekuatan yang tak terkalahkan oleh manusia, dikalahkan oleh makhluk paling kecil.",
        "hl": [
          "makhluk paling kecil"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "sunset",
    "chapter": "15",
    "title": "Matahari dari barat",
    "mood": "build",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Salah satu tanda yang paling menentukan adalah terbitnya matahari dari barat.",
        "hl": [
          "matahari dari barat"
        ],
        "pause": 0.7
      },
      {
        "text": "Nabi bersabda: ketika matahari terbit dari barat dan manusia melihatnya, semuanya beriman. Tetapi saat itu, iman tidak lagi bermanfaat bagi orang yang sebelumnya belum beriman. Hadis riwayat Bukhari, merujuk surah Al-An'am ayat seratus lima puluh delapan.",
        "hl": [
          "iman tidak lagi bermanfaat"
        ],
        "pause": 0.7
      },
      {
        "text": "Pintu taubat ditutup.",
        "hl": [
          "Pintu taubat ditutup"
        ],
        "pause": 0.7
      },
      {
        "text": "Muncul pula binatang dari bumi yang berbicara kepada manusia, sebagaimana disebut dalam surah An-Naml ayat delapan puluh dua.",
        "hl": [
          "binatang dari bumi"
        ],
        "pause": 0.7
      },
      {
        "text": "Setelah itu, tidak ada lagi kesempatan untuk memulai dari awal.",
        "hl": [
          "tidak ada lagi kesempatan"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "final",
    "chapter": "16",
    "title": "Angin, api, dan tiupan sangkakala",
    "mood": "wonder",
    "part": 3,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Kemudian Allah mengirim angin yang lembut, mencabut nyawa setiap orang beriman, bahkan yang di hatinya hanya ada iman seberat biji sawi.",
        "hl": [
          "angin yang lembut"
        ],
        "pause": 0.7
      },
      {
        "text": "Yang tersisa hanyalah manusia-manusia terburuk. Kepada merekalah kiamat terjadi. Hadis riwayat Muslim.",
        "hl": [
          "manusia-manusia terburuk"
        ],
        "pause": 0.7
      },
      {
        "text": "Api keluar dari Yaman, menggiring manusia ke tempat mereka dikumpulkan.",
        "hl": [
          "menggiring manusia"
        ],
        "pause": 0.7
      },
      {
        "text": "Lalu sangkakala ditiup. Matilah semua yang ada di langit dan di bumi, kecuali yang dikehendaki Allah. Kemudian ditiup sekali lagi, dan mereka bangkit menunggu. Surah Az-Zumar ayat enam puluh delapan.",
        "hl": [
          "sangkakala ditiup"
        ],
        "pause": 0.7
      },
      {
        "text": "Setelah itu: kebangkitan, perhitungan amal, timbangan, dan kehidupan yang tidak berakhir.",
        "hl": [
          "kehidupan yang tidak berakhir"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "peak",
    "chapter": "17",
    "title": "Renungan: puncak peradaban manusia",
    "mood": "wonder",
    "part": 4,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Sekarang, mari merenung. Ingat, bagian ini pemikiran, bukan tafsir.",
        "hl": [
          "pemikiran, bukan tafsir"
        ],
        "pause": 0.7
      },
      {
        "text": "Ada satu ayat yang terasa seperti gambaran zaman kita. Surah Yunus ayat dua puluh empat.",
        "hl": [
          "Surah Yunus ayat dua puluh empat"
        ],
        "pause": 0.7
      },
      {
        "text": "Hingga apabila bumi telah sempurna keindahannya dan berhias, dan penduduknya mengira mereka benar-benar menguasainya, datanglah ketetapan Kami.",
        "hl": [
          "mengira mereka benar-benar menguasainya"
        ],
        "pause": 0.7
      },
      {
        "text": "Manusia hari ini membelah atom, terbang ke luar angkasa, mengedit gen, dan membuat mesin yang meniru pikiran.",
        "hl": [
          "meniru pikiran"
        ],
        "pause": 0.7
      },
      {
        "text": "Perhatikan juga pola kisah Yakjuj dan Makjuj: puncaknya adalah keyakinan bahwa mereka bisa menaklukkan langit.",
        "hl": [
          "menaklukkan langit"
        ],
        "pause": 0.7
      },
      {
        "text": "Mungkin akhir zaman bukan zaman ketika manusia lemah, tetapi zaman ketika manusia merasa paling kuat.",
        "hl": [
          "merasa paling kuat"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "aiDajjal",
    "chapter": "18",
    "title": "Renungan: kecerdasan buatan dan fitnah Dajjal",
    "mood": "build",
    "part": 4,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Banyak orang bertanya: apakah kecerdasan buatan adalah Dajjal?",
        "hl": [
          "apakah kecerdasan buatan adalah Dajjal"
        ],
        "pause": 0.7
      },
      {
        "text": "Mayoritas ulama memahami Dajjal sebagai sosok manusia yang nyata, dengan ciri-ciri fisik yang disebut Nabi. Jadi teknologi bukanlah Dajjal itu sendiri.",
        "hl": [
          "sosok manusia yang nyata"
        ],
        "pause": 0.7
      },
      {
        "text": "Tetapi coba perhatikan jenis fitnahnya: menampilkan surga yang sebenarnya neraka. Membuat yang palsu tampak benar.",
        "hl": [
          "yang palsu tampak benar"
        ],
        "pause": 0.7
      },
      {
        "text": "Hari ini, mesin sudah bisa membuat wajah, suara, dan video yang tak bisa dibedakan dari aslinya. Kita mulai hidup di dunia ketika mata tidak lagi bisa dipercaya.",
        "hl": [
          "mata tidak lagi bisa dipercaya"
        ],
        "pause": 0.7
      },
      {
        "text": "Mungkin inilah pelajarannya: dunia sedang dilatih untuk menghadapi fitnah ilusi. Yang selamat bukan yang paling pandai melihat, melainkan yang hatinya paling jernih mengenali kebenaran.",
        "hl": [
          "hatinya paling jernih"
        ],
        "pause": 0.7
      },
      {
        "text": "Nabi berkata, tulisan kafir di dahi Dajjal bisa dibaca setiap mukmin, baik yang bisa membaca maupun tidak. Iman, bukan kecerdasan, yang menjadi pembeda.",
        "hl": [
          "Iman, bukan kecerdasan"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "aiYajuj",
    "chapter": "19",
    "title": "Renungan: kekuatan yang tak terbendung",
    "mood": "build",
    "part": 4,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Bagaimana dengan Yakjuj dan Makjuj?",
        "hl": [
          "Yakjuj dan Makjuj"
        ],
        "pause": 0.7
      },
      {
        "text": "Hadis menyebut mereka keturunan Adam, dengan peristiwa yang sangat nyata: meminum danau, lalu mati karena ulat. Menyamakan mereka dengan teknologi hari ini adalah tafsiran yang lemah.",
        "hl": [
          "tafsiran yang lemah"
        ],
        "pause": 0.7
      },
      {
        "text": "Tetapi ada pola yang menarik untuk direnungkan: kekuatan yang tak seorang pun mampu melawannya, jumlahnya sangat banyak, menyebar dari segala penjuru, dan menghabiskan sumber daya bumi.",
        "hl": [
          "menghabiskan sumber daya bumi"
        ],
        "pause": 0.7
      },
      {
        "text": "Bandingkan dengan zaman kita. Pusat-pusat data kecerdasan buatan menghabiskan miliaran liter air setiap tahun hanya untuk mendinginkan mesin-mesinnya.",
        "hl": [
          "miliaran liter air"
        ],
        "pause": 0.7
      },
      {
        "text": "Rombongan pertama meminum danau, sampai rombongan terakhir berkata: dulu di sini pernah ada air. Siapa yang bisa menebak, seberapa banyak mesin dan robot akan ada di bumi beberapa puluh tahun lagi?",
        "hl": [
          "dulu di sini pernah ada air"
        ],
        "pause": 0.7
      },
      {
        "text": "Manusia hari ini sedang membangun kekuatan yang jumlahnya terus berlipat, dan mungkin suatu saat tak bisa lagi ia kendalikan.",
        "hl": [
          "tak bisa lagi ia kendalikan"
        ],
        "pause": 0.7
      },
      {
        "text": "Sekali lagi, ini kemiripan pola, bukan tafsir. Yang pasti hanyalah apa yang disebut wahyu.",
        "hl": [
          "kemiripan pola, bukan tafsir"
        ],
        "pause": 0.7
      },
      {
        "text": "Dan kisah itu berakhir dengan pelajaran yang tajam: kekuatan sebesar apa pun, tunduk pada kehendak Allah, bahkan lewat makhluk paling kecil.",
        "hl": [
          "tunduk pada kehendak Allah"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "unseen",
    "chapter": "20",
    "title": "Renungan: yang belum bisa dibayangkan",
    "mood": "wonder",
    "part": 4,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Bagaimana Dajjal mendatangi seluruh negeri hanya dalam empat puluh hari? Bagaimana satu hari bisa seperti setahun?",
        "hl": [
          "seperti setahun"
        ],
        "pause": 0.7
      },
      {
        "text": "Para sahabat dulu tidak bisa membayangkan perjalanan secepat itu. Kita, yang hidup di zaman pesawat dan internet, sedikit lebih bisa membayangkannya.",
        "hl": [
          "sedikit lebih bisa membayangkannya"
        ],
        "pause": 0.7
      },
      {
        "text": "Mungkin ada hal-hal dalam hadis yang baru bisa dipahami oleh generasi setelah kita, dengan cara yang hari ini belum terbayangkan.",
        "hl": [
          "belum terbayangkan"
        ],
        "pause": 0.7
      },
      {
        "text": "Para sahabat bertanya, bagaimana dengan salat di hari yang seperti setahun itu? Nabi menjawab: perkirakanlah waktunya. Agama ini tetap memberi petunjuk, bahkan di keadaan yang paling aneh.",
        "hl": [
          "perkirakanlah waktunya"
        ],
        "pause": 0.7
      },
      {
        "text": "Akal boleh bertanya dan merenung. Tetapi bagian yang gaib tetap milik Allah, dan kita mengimaninya tanpa harus memastikan bentuknya.",
        "hl": [
          "tetap milik Allah"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "provision",
    "chapter": "21",
    "title": "Bekal menghadapi akhir zaman",
    "mood": "resolve",
    "part": 4,
    "lead": 1.2,
    "tail": 1.4,
    "lines": [
      {
        "text": "Lalu, apa yang harus kita lakukan?",
        "hl": [
          "apa yang harus kita lakukan"
        ],
        "pause": 0.7
      },
      {
        "text": "Nabi mengajarkan perlindungan: hafalkan sepuluh ayat pertama surah Al-Kahfi, niscaya ia terlindung dari Dajjal. Hadis riwayat Muslim.",
        "hl": [
          "sepuluh ayat pertama surah Al-Kahfi"
        ],
        "pause": 0.7
      },
      {
        "text": "Nabi juga mengajarkan doa di akhir salat: berlindung kepada Allah dari azab neraka, azab kubur, fitnah hidup dan mati, dan fitnah Al-Masih Ad-Dajjal. Hadis riwayat Muslim.",
        "hl": [
          "fitnah Al-Masih Ad-Dajjal"
        ],
        "pause": 0.7
      },
      {
        "text": "Jagalah amanah, carilah ilmu dari yang ahli, dan jadilah orang yang jernih membedakan yang benar dari yang tampak benar.",
        "hl": [
          "jagalah amanah"
        ],
        "pause": 0.7
      },
      {
        "text": "Dan ingat: kiamat bagi setiap orang dimulai saat ia wafat. Itu bisa datang kapan saja.",
        "hl": [
          "saat ia wafat"
        ],
        "pause": 0.7
      },
      {
        "text": "Nabi bersabda: jika kiamat terjadi, dan di tangan salah seorang dari kalian ada bibit pohon, jika ia mampu menanamnya sebelum kiamat, tanamlah. Hadis riwayat Ahmad.",
        "hl": [
          "tanamlah"
        ],
        "pause": 0.9
      }
    ]
  },
  {
    "id": "recap",
    "chapter": "22",
    "title": "Rangkuman",
    "mood": "resolve",
    "lead": 1.0,
    "tail": 1.8,
    "lines": [
      {
        "text": "Mari rangkum alurnya.",
        "pause": 0.5
      },
      {
        "text": "Manusia diciptakan sebagai khalifah dan memikul amanah. Para nabi datang silih berganti, dan Nabi Muhammad menutup rantai itu: kiamat sedekat dua jari.",
        "hl": [
          "dua jari"
        ],
        "pause": 0.7
      },
      {
        "text": "Tanda-tanda kecil: bangunan menjulang, ilmu dicabut, waktu terasa cepat, amanah disia-siakan. Banyak yang sudah dan sedang terjadi.",
        "hl": [
          "Tanda-tanda kecil"
        ],
        "pause": 0.7
      },
      {
        "text": "Tanda-tanda besar: Mahdi, Dajjal, turunnya Isa, Yakjuj dan Makjuj, matahari dari barat, lalu angin yang mencabut iman dan tiupan sangkakala.",
        "hl": [
          "Tanda-tanda besar"
        ],
        "pause": 0.7
      },
      {
        "text": "Dan renungan untuk zaman kita: puncak kekuatan manusia, fitnah ilusi, dan kekuatan yang tak terbendung, semuanya tunduk pada kehendak Allah.",
        "hl": [
          "tunduk pada kehendak Allah"
        ],
        "pause": 0.7
      },
      {
        "text": "Jadi, di tengah dunia yang berlari, pertanyaannya bukan kapan akhir itu datang, melainkan: bibit apa yang sedang kita tanam hari ini? Wallahu a'lam.",
        "hl": [
          "bibit apa yang sedang kita tanam"
        ],
        "pause": 0.8
      }
    ]
  },
  {
    "id": "outro",
    "chapter": "",
    "title": "Penutup",
    "mood": "outro",
    "fixed": 16,
    "lines": []
  }
];
