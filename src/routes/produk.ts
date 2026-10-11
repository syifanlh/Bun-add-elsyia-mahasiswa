import { Elysia, t } from "elysia";
import { db } from "../db/index";
import { productsTable } from "../db/schema";
import { eq } from 'drizzle-orm';

export const produkRoute = new Elysia({
    prefix: "/produk"
});

// 1. READ ALL - Get semua produk
produkRoute.get("/", async () => {
    const data = await db.select().from(productsTable);
    return data;
});

// 2. READ BY ID - Get produk berdasarkan ID
produkRoute.get("/:id", async ({ params, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
        set.status = 400;
        return { message: "ID harus berupa angka" };
    }

    const data = await db.select()
        .from(productsTable)
        .where(eq(productsTable.id, id));

    if (data.length === 0) {
        set.status = 404;
        return { message: "Produk tidak ditemukan" };
    }
    return data[0];
});

// 3. CREATE - Tambah produk baru
produkRoute.post("/", async ({ body, set }) => {
    try {
        const newProduct = await db.insert(productsTable)
            .values({
                name: body.name,
                stok: body.stok,
                harga: body.harga,
            })
            .returning();

        set.status = 201;
        return { message: "Produk berhasil ditambahkan", data: newProduct[0] };
    } catch (err) {
        set.status = 500;
        return { message: "Gagal menambah produk" };
    }
}, {
    body: t.Object({
        name: t.String(),
        stok: t.Number(),
        harga: t.Number()
    })
});

// 4. UPDATE - Ubah data produk
produkRoute.put("/:id", async ({ params, body, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
        set.status = 400;
        return { message: "ID harus berupa angka" };
    }

    const updatedProduct = await db.update(productsTable)
        .set({
            ...(body.name && { name: body.name }),
            ...(body.stok !== undefined && { stok: body.stok }),
            ...(body.harga !== undefined && { harga: body.harga }),
        })
        .where(eq(productsTable.id, id))
        .returning();

    if (updatedProduct.length === 0) {
        set.status = 404;
        return { message: "Produk tidak ditemukan" };
    }

    return { message: "Produk berhasil diperbarui", data: updatedProduct[0] };
}, {
    body: t.Object({
        name: t.Optional(t.String()),
        stok: t.Optional(t.Number()),
        harga: t.Optional(t.Number())
    })
});

// 5. DELETE - Hapus produk
produkRoute.delete("/:id", async ({ params, set }) => {
    const id = Number(params.id);
    if (isNaN(id)) {
        set.status = 400;
        return { message: "ID harus berupa angka" };
    }

    const deletedProduct = await db.delete(productsTable)
        .where(eq(productsTable.id, id))
        .returning();

    if (deletedProduct.length === 0) {
        set.status = 404;
        return { message: "Produk tidak ditemukan" };
    }

    return { message: "Produk berhasil dihapus", data: deletedProduct[0] };
});