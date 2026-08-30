/**
 * Lightweight i18n hook reading from Zustand locale.
 * Supports nested keys like "nav.home" and {{variable}} interpolation.
 */
import { useCallback, useMemo } from 'react';
import useStore from '../store/useStore';
import en from './en.json';
import fr from './fr.json';

const translations = { en, fr };

/**
 * Resolve nested object key path.
 * @param {object} obj
 * @param {string} path
 * @returns {string|undefined}
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

/**
 * Replace {{var}} placeholders in template strings.
 * @param {string} str
 * @param {Record<string, string|number>} [vars]
 * @returns {string}
 */
function interpolate(str, vars = {}) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? ''));
}

export function useTranslation() {
  const locale = useStore((s) => s.locale);

  const t = useCallback(
    (key, vars) => {
      const value = getNestedValue(translations[locale], key) ?? getNestedValue(translations.en, key) ?? key;
      return typeof value === 'string' && vars ? interpolate(value, vars) : value;
    },
    [locale]
  );

  return useMemo(() => ({ t, locale }), [t, locale]);
}

export default useTranslation;
