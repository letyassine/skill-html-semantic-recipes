---
name: html-semantic-recipes
description: Provides semantic HTML5 markup patterns for common UI components (breadcrumbs, cards, navigation, forms, login, accordion, definition lists, checkbox groups) adapted for HTML, React, Vue, Angular, Svelte, and Astro. Use when writing or generating UI markup, building accessible components, creating forms with validation, or when the user asks for semantic HTML, accessible markup, or framework-agnostic component skeletons.
---

# HTML Semantic Recipes

Semantic HTML markup recipes for common UI components, adapted per framework. Prefer semantic elements over `div` soup, include accessibility attributes, and match the target framework's syntax.

## When to Use This Skill

- Building UI components: cards, navigation, breadcrumbs, accordions, key-value lists
- Creating forms: basic contact forms, login forms, inline validation, error summaries
- User asks for "semantic HTML", "accessible markup", or "clean HTML structure"
- Generating component skeletons in HTML, React (JSX/TSX), Vue, Angular, Svelte, or Astro

## Core Principles

1. **Semantic elements first** — `article`, `header`, `footer`, `nav`, `section`, `fieldset`, `legend`, `dl`/`dt`/`dd`, `details`/`summary` instead of `div`/`span`
2. **Accessibility built in** — every input gets a `<label for>`; validation messages use `aria-live`; error summaries use `role="alert"`; use `aria-describedby` to link inputs to errors
3. **Minimal styling hooks** — only add `class` where a visual grouping is truly needed (e.g., accordion wrapper); let consumers style with their own CSS
4. **Framework adaptation** — adapt attribute syntax and directives to the target framework (see table below)

## Framework Adaptation Rules

| Concern            | HTML            | React                  | Vue                        | Angular                          | Svelte                          | Astro                 |
| ------------------ | --------------- | ---------------------- | -------------------------- | -------------------------------- | ------------------------------- | --------------------- |
| Class attribute    | `class`         | `className`            | `class`                    | `class`                          | `class`                         | `class`               |
| Label attribute    | `for`           | `htmlFor`              | `for`                      | `for`                            | `for`                           | `for`                 |
| Autocomplete       | `autocomplete`  | `autoComplete`         | `autocomplete`             | `autocomplete`                   | `autocomplete`                  | `autocomplete`        |
| Input binding      | —               | state/props            | `v-model`                  | `[(ngModel)]`                    | `bind:value`                    | —                     |
| Checkbox group     | `name`          | state                  | `v-model` + `value`        | `[(ngModel)]` + `name`           | `bind:group` + `value`          | `name` + `value`      |
| Form submit        | `action`/`method` | `onSubmit` handler   | `@submit.prevent`          | `(ngSubmit)` + `#ref="ngForm"`   | `on:submit\|preventDefault`     | comment: add handler  |
| List rendering     | static markup   | `.map()`               | `v-for` + `:key`           | `*ngFor` + `trackBy`             | `{#each}`                       | `{items.map()}`       |
| Conditional render | static/hidden   | `{cond && ...}`        | `v-if`                     | `*ngIf`                          | `{#if}`                         | JS in code fence      |
| Internal links     | `<a href>`      | `<a href>` / `<Link>`  | `<router-link to>`         | `<a [routerLink]>`               | `<a href>` / `<Link>`           | `<a href>`            |
| Disabled state     | `disabled`      | `disabled`             | `:disabled`                | `[disabled]`                     | `disabled={...}`                | `disabled`            |

## Recipe Index

| Recipe                | Use for                                              | Reference file                        |
| --------------------- | ---------------------------------------------------- | ------------------------------------- |
| `breadcrumbs`         | Hierarchical path navigation                         | `references/recipes.md#breadcrumbs`   |
| `nav`                 | Primary site/menu navigation                         | `references/recipes.md#navigation`   |
| `card`                | Single content card (header/body/footer)             | `references/recipes.md#card`          |
| `cardlist`            | Ordered collection of cards                          | `references/recipes.md#card-list`     |
| `datalist`            | Key-value detail display (`dl`/`dt`/`dd`)            | `references/recipes.md#data-list`     |
| `checkboxlist`        | Grouped checkbox options (`fieldset`/`legend`)       | `references/recipes.md#checkbox-list` |
| `formbasic`           | Standard contact/form fields                         | `references/recipes.md#form-basic`    |
| `formvalidation`      | Form with inline per-field error messages            | `references/recipes.md#form-inline`   |
| `formvalidationsummary` | Form with error summary + per-field errors         | `references/recipes.md#form-summary`  |
| `login`               | Username/password auth form                          | `references/recipes.md#login-form`    |
| `accordion`           | Expandable sections (`details`/`summary`)            | `references/recipes.md#accordion`     |

## How to Apply a Recipe

1. **Identify the component** the user needs (card, form, nav, etc.) and the **target framework** from the project context (check file extensions, imports, `package.json`).
2. **Read the matching recipe** in `references/recipes.md` — each recipe has an HTML base plus per-framework variants.
3. **Substitute placeholders** with real content: replace generic titles, hrefs, field names, and copy with the user's actual domain values.
4. **Keep accessibility wiring intact** — never drop `label`/`for` pairs, `aria-live` on validation messages, or `role="alert"` on error summaries.
5. **Match project conventions** — if the codebase uses a router component (`Link`, `router-link`), component libraries, or CSS modules, adapt the link/binding syntax accordingly while preserving the semantic structure.

## Quick Reference: Semantic Element Choices

- **Card** → `article` with `header`, content, `footer` (not `div.card`)
- **Breadcrumbs** → `nav` containing a `p` of links (not `ol` of `div`s)
- **Key-value data** → `dl`/`dt`/`dd` (not tables or definition divs)
- **Checkbox groups** → `fieldset` + `legend` (not bare divs of checkboxes)
- **Accordion** → `details`/`summary` (native, keyboard accessible — no JS required)
- **Validation summary** → `section[role=alert]` with anchor links to each invalid field
- **Form fields** → every control wrapped in `p` with a real `label[for]` — never placeholder-only labels

## Full Markup

The complete, copy-paste-ready markup for every recipe and framework is in `references/recipes.md`. Load that file when you need the exact patterns; use this SKILL.md for routing and rules.
