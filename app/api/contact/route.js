import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { nama, email, pesan } = body;

    if (!nama || !email || !pesan) {
      return NextResponse.json(
        { success: false, message: "Semua bidang (Nama, Email, Pesan) wajib diisi." },
        { status: 400 }
      );
    }

    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
      "e30953a7-e0d0-4bf6-b516-24e05b5505f5";

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: nama,
        email: email,
        message: pesan,
        subject: `Pesan Portofolio Baru dari ${nama}`,
        from_name: "Portofolio Donie Makapeli",
        to_email: "dmakapeli@gmail.com",
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return NextResponse.json({
        success: true,
        message: "Pesan berhasil dikirim ke dmakapeli@gmail.com!",
      });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || "Gagal mengirim pesan via Web3Forms." },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server saat mengirim pesan." },
      { status: 500 }
    );
  }
}
