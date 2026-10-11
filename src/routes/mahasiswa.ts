import { Elysia } from "elysia";

const mahasiswa = [
    {
        id: 1,
        nama: "Ahmad",
        email: "ahmad@example.com",
        jurusan: "Teknik Informatika"
    },
    {
        id: 2,
        nama: "Anisa",
        email: "anisa@example.com",
        jurusan: "Manajemen Informatika"
    },
    {
        id: 3,
        nama: "Andika",
        email: "andika@example.com",
        jurusan: "Teknik Informatika"
    }
];

export const mahasiswaRoute = new Elysia({
    prefix: "/mahasiswa"
});

mahasiswaRoute.get("/:id", ({ params }) => {
    const mahasiswaId = params.id;
    const data = mahasiswa.find(m => m.id === parseInt(mahasiswaId));
    if (data) {
        return data;
    } else {
        return { error: "Mahasiswa tidak ditemukan" };
    }
});

mahasiswaRoute.post("/", ({ body, set }) => {
    if (!body) {
        set.status = 400;
        return { error: "Tidak ada data yang masuk" };
    }

    const data = body as {
        id: number;
        nama: string;
        email: string;
        jurusan: string;
    };

    const sudahAda = mahasiswa.some(m => m.id === data.id);

    if (sudahAda) {
        set.status = 409;
        return { error: "ID mahasiswa sudah digunakan" };
    }

    mahasiswa.push(data);

    return {
        message: "Mahasiswa berhasil ditambahkan",
        data
    };
});

mahasiswaRoute.put("/:id", ({ params, body, set }) => {
    const id = parseInt(params.id);
    const index = mahasiswa.findIndex(m => m.id === id);

    if (index === -1) {
        set.status = 404;
        return { error: "Mahasiswa tidak ditemukan" };
    }

    const data = body as {
        nama: string;
        email: string;
        jurusan: string;
    };

    mahasiswa[index] = {
        id,
        ...data
    };

    return {
        message: "Data mahasiswa berhasil diperbarui",
        data: mahasiswa[index]
    };
});


mahasiswaRoute.patch("/:id", ({ params, body, set }) => {
    const id = parseInt(params.id);
    const data = mahasiswa.find(m => m.id === id);

    if (!data) {
        set.status = 404;
        return { error: "Mahasiswa tidak ditemukan" };
    }

    Object.assign(data, body);

    return {
        message: "Data mahasiswa berhasil diperbarui",
        data
    };
});


mahasiswaRoute.delete("/:id", ({ params, set }) => {
    const id = parseInt(params.id);
    const index = mahasiswa.findIndex(m => m.id === id);

    if (index === -1) {
        set.status = 404;
        return { error: "Mahasiswa tidak ditemukan" };
    }

    const data = mahasiswa.splice(index, 1)[0];

    return {
        message: "Mahasiswa berhasil dihapus",
        data
    };
});


mahasiswaRoute.connect("/", () => {
    return {
        message: "CONNECT berhasil",
        info: "Endpoint CONNECT mahasiswa aktif"
    };
});