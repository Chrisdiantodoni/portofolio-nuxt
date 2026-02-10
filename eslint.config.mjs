import drizzlePlugin from "eslint-plugin-drizzle";
import tseslint from "typescript-eslint";

export default [
  // Konfigurasi dasar TypeScript
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx", "**/*.vue", "server/**/*.ts"],
    plugins: {
      drizzle: drizzlePlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
      },
    },
    rules: {
      // --- ATURAN DRIZZLE (PENTING) ---

      // 1. Mencegah update/delete tanpa 'where' (Bahaya banget kalau lupa!)
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error",

      // --- ATURAN NAMING CONVENTION (OPSIONAL TAPI BAGUS) ---

      // Memaksa penamaan variabel di TS harus camelCase (misal: publishedAt)
      // Tapi membiarkan properti object/kolom DB bebas (karena butuh snake_case)
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
        },
        {
          selector: "function",
          format: ["camelCase"],
        },
        {
          selector: "interface",
          format: ["PascalCase"],
        },
      ],

      // --- ATURAN UMUM ---
      "no-console": "warn", // Ingatkan kalau ada console.log ketinggalan
      "@typescript-eslint/no-explicit-any": "warn", // Hindari penggunaan 'any'
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
];
