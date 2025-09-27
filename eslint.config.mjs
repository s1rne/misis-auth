import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Отключаем строгие правила для any
      "@typescript-eslint/no-explicit-any": "warn",
      // Отключаем предупреждения о неиспользуемых переменных
      "@typescript-eslint/no-unused-vars": "warn",
      // Отключаем правило о HTML ссылках (можно использовать <a>)
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;
