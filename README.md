# next-query-helpers

A lightweight utility hook to manage query parameters in **Next.js App Router** using React.

---

## ✨ Features

- ✅ Type-safe query manipulation
- ✅ Add, remove, and reset query parameters easily
- ✅ Supports multi-value (array) keys
- ✅ SSR-safe `getQueryParam` with fallback
- ✅ Zero dependencies (besides `next` and `react`)
- ✅ Built for modern Next.js (13+ with App Router)

---

## 📦 Installation

```bash
npm install next-query-helpers
```

or with yarn:

```bash
yarn add next-query-helpers
```

---

## 🚀 Usage

```tsx
'use client';

import { useQueryParams } from 'next-query-helpers';

export default function Page() {
  const {
    addQueryParams,
    removeQueryParams,
    resetQueryParams,
    getQueryParam
  } = useQueryParams();

  const handleFilter = () => {
    addQueryParams({ sort: 'latest', tags: ['react', 'next'] }, { merge: true });
  };

  const handleClear = () => {
    removeQueryParams(['sort', 'tags']);
  };

  const sort = getQueryParam('sort', 'default');

  return (
    <div>
      <p>Sort: {sort}</p>
      <button onClick={handleFilter}>Add Filters</button>
      <button onClick={handleClear}>Remove Filters</button>
    </div>
  );
}
```

---

## 🧠 API

### `addQueryParams(query: Record<string, string | string[]>, options?: { merge?: boolean, scroll?: boolean })`

Adds or updates one or more query parameters.

- `merge: true` – merges with existing params
- `scroll: false` – prevents scroll to top

---

### `removeQueryParams(keys: string | string[], options?: { scroll?: boolean })`

Removes one or more keys from the query string.

---

### `resetQueryParams(options?: { scroll?: boolean })`

Clears all query parameters.

---

### `getQueryParam(key: string, fallback?: any)`

Returns the value of a query parameter, or the fallback value (SSR-safe).

---

## ✅ Compatibility

- Next.js 13+ (App Router only)
- React 18+
- TypeScript supported

---

## 📄 License

MIT © [Hossein Khezeli](https://github.com/hosseinkhezeli)