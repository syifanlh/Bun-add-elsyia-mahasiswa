import { Elysia } from "elysia";
import { mahasiswaRoute } from "./routes/mahasiswa";
import { produkRoute } from "./routes/produk";

const app = new Elysia();

app.use(mahasiswaRoute);
app.use(produkRoute);

// Konversi process.env.PORT dari string ke number
const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT);

console.log(`Server berjalan pada http://${app.server?.hostname}:${app.server?.port}`);