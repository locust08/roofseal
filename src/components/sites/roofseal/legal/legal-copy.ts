type LegalSection = { title: string; paragraphs: string[] };
type LegalLanguage = { id: string; lang: "en" | "ms"; title: string; intro: string; sections: LegalSection[] };
type LegalCopy = { title: string; languages: LegalLanguage[] };
export type LegalDocument = "terms" | "privacy";

/** Generated review copy, not client-approved legal or commercial policy. */
export const legalCopy: Record<LegalDocument, LegalCopy> = {
  terms: {
    title: "Terms & Conditions",
    languages: [
      {
        id: "english", lang: "en", title: "Website Terms & Conditions",
        intro: "These draft terms describe the proposed use of the Roofseal Resources (M) Sdn Bhd website and its product information, enquiry forms and quote list.",
        sections: [
          { title: "Website information", paragraphs: ["Product descriptions, images, catalogues and project examples provide general information. Confirm the latest specifications, availability and suitability for your project with Roofseal before ordering or relying on them for design or installation."] },
          { title: "Enquiries and quotations", paragraphs: ["Adding products to a quote list or submitting a form requests a response from Roofseal. A submission reference acknowledges receipt of an enquiry; it does not confirm an order or form a commercial contract.", "Prices, quantities, delivery arrangements, payment, returns and any product warranties must be set out in the applicable quotation or separately agreed commercial documents. This website draft does not establish those terms."] },
          { title: "Using the website", paragraphs: ["Provide accurate contact and project details and only share information you are authorised to provide. Please do not submit confidential third-party information, misuse the forms, interfere with the website or attempt unauthorised access."] },
          { title: "Content and product selection", paragraphs: ["Contact Roofseal before reproducing website materials for commercial use. Product selection and installation should be assessed against the requirements of the project, relevant technical documentation and advice from appropriately qualified professionals."] },
          { title: "External services and personal information", paragraphs: ["Links and embedded services may be operated by other providers and have their own terms. Our draft Privacy Policy describes the website’s enquiry data and service providers. Review it before sending personal information."] },
          { title: "Questions and updates", paragraphs: ["For questions about this website or a proposed purchase, contact Roofseal using the email below. Any future approved website terms should carry their own publication date; this draft has no approved effective date."] },
        ],
      },
      {
        id: "bahasa-malaysia", lang: "ms", title: "Terma & Syarat Laman Web",
        intro: "Terma draf ini menerangkan cadangan penggunaan laman web Roofseal Resources (M) Sdn Bhd, maklumat produk, borang pertanyaan dan senarai permintaan sebut harga.",
        sections: [
          { title: "Maklumat laman web", paragraphs: ["Penerangan produk, imej, katalog dan contoh projek disediakan sebagai maklumat umum. Sahkan spesifikasi terkini, ketersediaan dan kesesuaian bagi projek anda dengan Roofseal sebelum membuat pesanan atau menggunakannya untuk reka bentuk atau pemasangan."] },
          { title: "Pertanyaan dan sebut harga", paragraphs: ["Menambah produk ke senarai sebut harga atau menghantar borang merupakan permintaan untuk dihubungi oleh Roofseal. Nombor rujukan mengakui penerimaan pertanyaan; ia tidak mengesahkan pesanan atau mewujudkan kontrak komersial.", "Harga, kuantiti, penghantaran, pembayaran, pemulangan dan sebarang waranti produk hendaklah dinyatakan dalam sebut harga yang berkenaan atau dokumen komersial yang dipersetujui secara berasingan. Draf laman web ini tidak menetapkan terma tersebut."] },
          { title: "Penggunaan laman web", paragraphs: ["Berikan butiran hubungan dan projek yang tepat serta maklumat yang anda dibenarkan untuk berikan. Jangan hantar maklumat sulit pihak ketiga, menyalahgunakan borang, mengganggu laman web atau cuba mendapatkan akses tanpa kebenaran."] },
          { title: "Kandungan dan pemilihan produk", paragraphs: ["Hubungi Roofseal sebelum menghasilkan semula bahan laman web untuk kegunaan komersial. Pemilihan dan pemasangan produk hendaklah dinilai berdasarkan keperluan projek, dokumentasi teknikal berkaitan dan nasihat profesional yang berkelayakan."] },
          { title: "Perkhidmatan luar dan maklumat peribadi", paragraphs: ["Pautan dan perkhidmatan terbenam mungkin dikendalikan oleh penyedia lain dengan terma mereka sendiri. Draf Dasar Privasi kami menerangkan data pertanyaan dan penyedia perkhidmatan laman web. Sila baca sebelum menghantar maklumat peribadi."] },
          { title: "Pertanyaan dan kemas kini", paragraphs: ["Untuk pertanyaan mengenai laman web atau cadangan pembelian, hubungi Roofseal melalui e-mel di bawah. Terma laman web yang diluluskan kelak hendaklah mempunyai tarikh penerbitannya sendiri; draf ini belum mempunyai tarikh kuat kuasa yang diluluskan."] },
        ],
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    languages: [
      {
        id: "english", lang: "en", title: "Privacy Notice",
        intro: "This draft describes personal information handled through the Roofseal Resources (M) Sdn Bhd website. It covers website enquiries and quote requests; Roofseal must confirm its wider business practices before approving this notice.",
        sections: [
          { title: "Information you provide", paragraphs: ["Contact and quote forms collect your name, company, email address, telephone number and message. Depending on the form, they also collect enquiry type, state or location, project type, project location, estimated quantities or requirements, and selected products. Successful submissions store an enquiry reference and the wording and time of your consent.", "Fields marked with an asterisk and consent are required for online submission. Without them, the form cannot be submitted. Optional project details help explain your requirements. Please avoid sending sensitive personal information or other people’s details without authority."] },
          { title: "Why information is used", paragraphs: ["The proposed purposes are to respond to your enquiry, understand your project, prepare requested quotations and manage related follow-up. The website also checks submissions to prevent abuse and duplicate enquiries. Enquiry consent should not be treated as a separate subscription to promotional messages."] },
          { title: "Website storage and security checks", paragraphs: ["Selected quote products are saved in your browser’s local storage so the list remains available when you return. You can remove products or clear this data through your browser settings. Submitted enquiries are saved in the website’s enquiry system.", "The server uses a keyed hash derived from the visitor’s IP address for submission rate limiting when a trusted IP header is configured; otherwise it uses a shared limit. This rate-limit record is separate from the enquiry content."] },
          { title: "Service providers and embedded content", paragraphs: ["The hosting setup uses Cloudflare infrastructure. BugHerd is used for website feedback and may process feedback, screenshots and browser or page details when its feedback tool is used. The Contact Us page embeds Google Maps; loading the map connects your browser to Google. These providers may process technical information under their own privacy notices.", "Automated enquiry email delivery and Google Sheets synchronisation are currently disabled pending setup. This draft does not describe them as active recipients of enquiries. Roofseal must confirm provider access, processing locations and any transfers outside Malaysia before publication or enabling additional integrations."] },
          { title: "Retention and handling", paragraphs: ["Retention periods, deletion procedures and access arrangements for enquiries and technical records remain subject to Roofseal’s confirmation for this draft. No fixed retention period is approved here. Contact Roofseal if you have a question about a submitted enquiry or its handling."] },
          { title: "Your choices and requests", paragraphs: ["You may contact enquiry@roofseal.com.my to request access to or correction of your personal information, withdraw consent, or raise a privacy concern. Identify the enquiry and the request without sending unnecessary personal documents. Withdrawing consent may affect Roofseal’s ability to continue responding to the request. Roofseal should confirm any applicable identity checks and legal requirements when handling your request."] },
          { title: "Review and changes", paragraphs: ["This English and Bahasa Malaysia notice is generated draft copy for client review. Roofseal must approve the information and confirm operational details before publication. An approved notice should be updated when the website’s data handling changes."] },
        ],
      },
      {
        id: "bahasa-malaysia", lang: "ms", title: "Notis Privasi",
        intro: "Draf ini menerangkan maklumat peribadi yang dikendalikan melalui laman web Roofseal Resources (M) Sdn Bhd. Ia meliputi pertanyaan laman web dan permintaan sebut harga; Roofseal perlu mengesahkan amalan perniagaannya yang lebih luas sebelum meluluskan notis ini.",
        sections: [
          { title: "Maklumat yang anda berikan", paragraphs: ["Borang pertanyaan dan sebut harga mengumpulkan nama, syarikat, alamat e-mel, nombor telefon dan mesej anda. Bergantung pada borang, maklumat juga merangkumi jenis pertanyaan, negeri atau lokasi, jenis projek, lokasi projek, anggaran kuantiti atau keperluan serta produk pilihan. Penghantaran yang berjaya menyimpan nombor rujukan pertanyaan serta teks dan masa persetujuan anda.", "Medan bertanda asterisk dan persetujuan diperlukan untuk penghantaran dalam talian. Tanpanya, borang tidak boleh dihantar. Butiran projek pilihan membantu menjelaskan keperluan anda. Elakkan menghantar maklumat peribadi sensitif atau butiran orang lain tanpa kebenaran."] },
          { title: "Tujuan penggunaan maklumat", paragraphs: ["Tujuan yang dicadangkan ialah menjawab pertanyaan, memahami projek, menyediakan sebut harga yang diminta dan mengurus susulan berkaitan. Laman web turut menyemak penghantaran untuk mengelakkan penyalahgunaan dan pertanyaan berulang. Persetujuan pertanyaan tidak sepatutnya dianggap sebagai langganan berasingan untuk mesej promosi."] },
          { title: "Storan laman web dan semakan keselamatan", paragraphs: ["Produk dalam senarai sebut harga disimpan dalam storan setempat pelayar anda supaya senarai tersedia apabila anda kembali. Anda boleh membuang produk atau memadam data ini melalui tetapan pelayar. Pertanyaan yang dihantar disimpan dalam sistem pertanyaan laman web.", "Pelayan menggunakan hash berkunci yang diperoleh daripada alamat IP pelawat untuk mengehadkan kadar penghantaran apabila pengepala IP dipercayai dikonfigurasi; jika tidak, had bersama digunakan. Rekod had kadar ini berasingan daripada kandungan pertanyaan."] },
          { title: "Penyedia perkhidmatan dan kandungan terbenam", paragraphs: ["Pengehosan menggunakan infrastruktur Cloudflare. BugHerd digunakan untuk maklum balas laman web dan mungkin memproses maklum balas, tangkap layar serta butiran pelayar atau halaman apabila alat maklum balas digunakan. Halaman Hubungi Kami membenamkan Google Maps; memuatkan peta menghubungkan pelayar anda kepada Google. Penyedia ini mungkin memproses maklumat teknikal mengikut notis privasi mereka sendiri.", "Penghantaran e-mel pertanyaan automatik dan penyegerakan Google Sheets kini dinyahaktifkan sementara menunggu persediaan. Draf ini tidak menyenaraikannya sebagai penerima pertanyaan yang aktif. Roofseal perlu mengesahkan akses penyedia, lokasi pemprosesan dan sebarang pemindahan ke luar Malaysia sebelum penerbitan atau pengaktifan integrasi tambahan."] },
          { title: "Penyimpanan dan pengendalian", paragraphs: ["Tempoh penyimpanan, prosedur pemadaman dan aturan akses bagi pertanyaan serta rekod teknikal masih memerlukan pengesahan Roofseal untuk draf ini. Tiada tempoh penyimpanan tetap diluluskan di sini. Hubungi Roofseal jika anda mempunyai pertanyaan mengenai penghantaran atau pengendaliannya."] },
          { title: "Pilihan dan permintaan anda", paragraphs: ["Anda boleh menghubungi enquiry@roofseal.com.my untuk meminta akses kepada atau pembetulan maklumat peribadi, menarik balik persetujuan atau mengemukakan kebimbangan privasi. Kenal pasti pertanyaan dan permintaan tanpa menghantar dokumen peribadi yang tidak perlu. Penarikan balik persetujuan mungkin menjejaskan keupayaan Roofseal untuk meneruskan jawapan kepada permintaan. Roofseal perlu mengesahkan semakan identiti dan keperluan undang-undang yang berkenaan semasa mengendalikan permintaan anda."] },
          { title: "Semakan dan perubahan", paragraphs: ["Notis dalam bahasa Inggeris dan Bahasa Malaysia ini ialah teks draf yang dijana untuk semakan pelanggan. Roofseal perlu meluluskan maklumat dan mengesahkan butiran operasi sebelum penerbitan. Notis yang diluluskan hendaklah dikemas kini apabila pengendalian data laman web berubah."] },
        ],
      },
    ],
  },
};
