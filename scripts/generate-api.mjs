import { resolve } from "path";
import { generateApi } from "swagger-typescript-api";

await generateApi({
    name: "Api.ts",
    fileName: "Api.ts",
    output: resolve(process.cwd(), "./src/api"),
    url: "http://localhost:3000/api/docs-json",
    httpClientType: "axios",
    moduleNameIndex: 1,
    generateUnionEnums: true,
});
