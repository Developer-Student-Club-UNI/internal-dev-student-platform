/**
 * @repo/config/eslint-preset.mjs
 * Reglas Zero-Trust de arquitectura e interfaz para ESLint 9+
 */
export const idpGuardrailRules = {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'JSXOpeningElement[name.name="button"]',
      message:
        'PROHIBIDO usar <button> nativo fuera de @repo/ui. Importa { Button } from "@repo/ui".',
    },
    {
      selector: 'JSXOpeningElement[name.name="input"]',
      message:
        'PROHIBIDO usar <input> nativo fuera de @repo/ui. Importa { Input } from "@repo/ui".',
    },
    {
      selector: 'JSXOpeningElement[name.name="select"]',
      message:
        'PROHIBIDO usar <select> nativo fuera de @repo/ui. Importa { Select } from "@repo/ui".',
    },
    {
      selector: 'JSXOpeningElement[name.name="textarea"]',
      message:
        'PROHIBIDO usar <textarea> nativo fuera de @repo/ui. Importa { Textarea } from "@repo/ui".',
    },
    {
      selector: 'JSXOpeningElement[name.name="table"]',
      message:
        'PROHIBIDO usar <table> nativo fuera de @repo/ui. Importa { DataTable } from "@repo/ui".',
    },
    {
      selector: 'JSXAttribute[name.name="style"]',
      message:
        'PROHIBIDO usar estilos en línea (style={{...}}). Usa tokens semánticos de @repo/ui.',
    },
  ],
};

export default idpGuardrailRules;
