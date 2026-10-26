# Editing the Dictionary

## `add(lang, key, translation)`

Adds a new translation entry or updates an existing one. Supports dot notation for nested keys. Creates the language group automatically if it does not yet exist, and replaces any translation that is in the way of a nested key.

```ts
const dict = {
  en: { tr1: "Translation 1" },
  fr: { tr1: "Traduction 1" },
};
const translator = new EOTranslator(dict, "en");

// Add a new key
translator.add("en", "tr2", "Translation 2");

// Update an existing key
translator.add("en", "tr1", "Updated translation 1");

// Add a nested key: creates intermediate objects automatically
translator.add("fr", "menu.home", "Accueil");
translator.add("fr", "menu.about", "À propos");
```

## `remove(lang, key)`

Removes a translation entry from the dictionary. Supports dot notation. Does nothing if the language or key does not exist.

```ts
// Remove a top-level key
translator.remove("fr", "tr1");

// Remove a nested key
translator.remove("fr", "menu.about");
```

Both methods throw a `TypeError` when the language or the key is not a string, and edit the dictionary object you passed in place. They only follow and change the dictionary's own entries, so keys such as `__proto__` or `constructor.prototype` are stored as regular translations and never reach `Object.prototype`.
