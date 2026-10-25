import Link from "next/link";
import { Brand } from "./brand";
import { LocaleSwitch } from "./locale-switch";
import { currentLocale } from "@/i18n/server";
export async function LegalPage({ kind }: { kind: "privacy" | "terms" }) {
  const l = await currentLocale(),
    bm = l === "ms";
  const privacy = kind === "privacy";
  const sections = privacy
    ? bm
      ? [
          [
            "Data yang digunakan",
            "RFT menggunakan identiti Google (pengenal, nama dan e-mel), pilihan bahasa, akaun catatan, kategori, transaksi, pindahan dan matlamat yang anda masukkan. Jangan masukkan nombor akaun bank penuh, kata laluan atau data kad.",
          ],
          [
            "Tujuan dan penyedia",
            "Rekod digunakan untuk fungsi catatan dan analisis berasaskan peraturan. Vercel menghoskan aplikasi; Supabase menguruskan pengesahan dan pangkalan data. Projek semasa berada di rantau ap-south-1. Google mengendalikan log masuk. Penyedia mungkin memproses data di luar Malaysia. RFT tidak menggunakan penjejak pengiklanan atau menghantar catatan kewangan kepada AI luaran.",
          ],
          [
            "Kawalan dan keselamatan",
            "Akses rekod dihadkan mengikut pengguna di pangkalan data. TOTP ialah pilihan untuk didaftarkan dan wajib disahkan selepas didaftarkan. Tiada sistem yang menjamin perlindungan mutlak. Peranti dan fail CSV anda perlu dilindungi sendiri.",
          ],
          [
            "Eksport, pemadaman dan simpanan",
            "Anda boleh mengeksport catatan. Pemadaman akaun memerlukan pengesahan terkini dan memadam rekod aplikasi serta identiti RFT. RFT tidak mengendalikan sandaran aplikasi pada masa ini. Log penyedia mungkin disimpan mengikut dasar penyedia. Data yang dipadam atau hilang mungkin tidak boleh dipulihkan. Simpan eksport peribadi yang dilindungi jika anda memerlukan salinan.",
          ],
          [
            "Status notis",
            "Draf prapelancaran, 24 Oktober 2026. Semakan pemilik terhadap pengendalian sebenar, simpanan dan kewajipan Malaysia belum selesai. Draf ini tidak mengesahkan pematuhan undang-undang.",
          ],
        ]
      : [
          [
            "What RFT uses",
            "RFT uses your Google identity (identifier, name and email), language preference, recorded accounts, categories, transactions, transfers and goals you enter. Do not enter full bank account numbers, banking passwords or card credentials.",
          ],
          [
            "Purpose and providers",
            "Records support manual tracking and deterministic, rule-based insights. Vercel hosts the application; Supabase manages authentication and the database. The current database project is in ap-south-1. Google handles sign-in. Providers may process data outside Malaysia. RFT has no advertising trackers and does not send financial records to external AI.",
          ],
          [
            "Controls and security",
            "Database policies restrict records to their owner. TOTP is optional to enroll and required for access once enrolled. No system guarantees absolute protection. Protect your device and any CSV files you download.",
          ],
          [
            "Export, deletion and retention",
            "You can export records. Account deletion requires recent identity verification and removes application records and your RFT identity. RFT does not currently operate application-managed backups. Provider logs may be retained under provider policies. Deleted or lost data may not be recoverable. Keep protected personal exports if you need a copy.",
          ],
          [
            "Notice status",
            "Prelaunch draft, 24 October 2026. Owner review of actual handling, retention and applicable Malaysian obligations remains outstanding. This draft does not certify legal compliance.",
          ],
        ]
    : bm
      ? [
          [
            "Kegunaan RFT",
            "RFT ialah alat catatan kewangan peribadi percuma dan bukan komersial. Anda memasukkan catatan sendiri. RFT bukan bank, perkhidmatan pindahan wang, penasihat kewangan atau sambungan bank.",
          ],
          [
            "Ketepatan catatan",
            "Baki ialah anggaran daripada catatan, bukan baki bank langsung. Semak catatan dengan penyata anda. Pindahan di RFT tidak memindahkan wang sebenar.",
          ],
          [
            "Akses dan ketersediaan",
            "Google digunakan untuk log masuk. Lindungi akaun dan pengesah anda. Infrastruktur percuma boleh mengalami had, jeda atau gangguan. Tiada jaminan akses berterusan atau sifar kehilangan data. Simpan eksport peribadi yang dilindungi.",
          ],
          [
            "Status terma",
            "Draf prapelancaran, 24 Oktober 2026. Semakan pemilik/undang-undang belum dimuktamadkan. Tiada pelancaran awam berdasarkan draf ini.",
          ],
        ]
      : [
          [
            "Using RFT",
            "RFT is a free, non-commercial personal finance record keeper. You enter records manually. It is not a bank, money-transfer service, financial adviser or bank connection.",
          ],
          [
            "Accuracy of your records",
            "Balances are estimates derived from your entries, not live bank figures. Reconcile your records with your statements. A transfer recorded in RFT does not move real money.",
          ],
          [
            "Access and availability",
            "Google is used for sign-in. Protect your account and authenticator. Free infrastructure can reach limits, pause or experience outages. Continuous availability and zero data loss are not guaranteed. Keep protected personal exports.",
          ],
          [
            "Terms status",
            "Prelaunch draft, 24 October 2026. Owner/legal review is not finalized. This draft does not authorize a public release.",
          ],
        ];
  return (
    <>
      <header className="public-header">
        <Brand />
        <LocaleSwitch locale={l} />
      </header>
      <main id="main" className="legal-page">
        <Link className="text-link" href="/">
          {bm ? "Kembali ke utama" : "Back to home"}
        </Link>
        <h1>
          {privacy
            ? bm
              ? "Notis privasi"
              : "Privacy notice"
            : bm
              ? "Terma penggunaan"
              : "Terms of use"}
        </h1>
        <section>
          <h2>{bm ? "Pengendali dan hubungan" : "Operator and contact"}</h2>
          <p>
            {bm ? "RFT dihasilkan oleh " : "RFT is made by "}
            <a href="https://ismailstudio.my">Ismail Studio</a>.
            {bm
              ? " Untuk pertanyaan privasi atau bantuan, e-mel "
              : " For privacy or support questions, email "}
            <a href="mailto:contact@ismailstudio.my">contact@ismailstudio.my</a>
            .
          </p>
          <p>
            {bm ? "Laman web: " : "Website: "}
            <a href="https://ismailstudio.my">ismailstudio.my</a>
          </p>
        </section>
        {sections.map(([heading, text]) => (
          <section key={heading}>
            <h2>{heading}</h2>
            <p>{text}</p>
          </section>
        ))}
      </main>
    </>
  );
}
