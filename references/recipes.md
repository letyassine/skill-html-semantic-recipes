# HTML Semantic Recipes — Full Markup

Complete markup for every recipe. Each section starts with the HTML base, followed by framework variants where the syntax differs. Substitute placeholder text (`Card Title`, `/products`, etc.) with real content.

---

## Breadcrumbs

Hierarchical path navigation. Use a `p` of links inside `nav` — the current page is the last link and does not need an anchor if it is not navigable.

### HTML / React / Svelte / Astro

```html
<nav>
  <p>
    <a href="/">Home</a>
    <a href="/products">Products</a>
    <a href="/details">Product Details</a>
  </p>
</nav>
```

React notes: use `<a href>` or the project's `<Link>` component; JSX keeps `href` as-is.

### Vue

```html
<nav>
  <p>
    <router-link to="/">Home</router-link>
    <router-link to="/products">Products</router-link>
    <router-link to="/details">Product Details</router-link>
  </p>
</nav>
```

### Angular

```html
<nav>
  <p>
    <a [routerLink]="['/']">Home</a>
    <a [routerLink]="['/products']">Products</a>
    <a [routerLink]="['/details']">Product Details</a>
  </p>
</nav>
```

---

## Navigation

Primary menu. A `nav` landmark containing a list of links.

### HTML / React / Svelte / Astro

```html
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>
```

### Vue

```html
<nav>
  <ul>
    <li><router-link to="/" exact>Home</router-link></li>
    <li><router-link to="/about">About</router-link></li>
    <li><router-link to="/products">Products</router-link></li>
    <li><router-link to="/contact">Contact</router-link></li>
  </ul>
</nav>
```

### Angular

```html
<nav>
  <ul>
    <li><a [routerLink]="['/']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a></li>
    <li><a [routerLink]="['/about']" routerLinkActive="active">About</a></li>
    <li><a [routerLink]="['/products']" routerLinkActive="active">Products</a></li>
    <li><a [routerLink]="['/contact']" routerLinkActive="active">Contact</a></li>
  </ul>
</nav>
```

---

## Card

A single content unit: `article` with `header`, body, and `footer`.

### HTML / React / Vue / Svelte / Astro

```html
<article>
  <header>
    <h2>Card Title</h2>
  </header>
  <p>Card content goes here providing key information to the user.</p>
  <footer>
    <a href="#">Action Link</a>
  </footer>
</article>
```

Vue variant footer:

```html
<footer>
  <router-link to="#">Action Link</router-link>
</footer>
```

Angular variant footer:

```html
<footer>
  <a [routerLink]="['#']">Action Link</a>
</footer>
```

---

## Card List

Ordered collection of cards. Use `ol` when order matters, `ul` otherwise.

### HTML / React

```html
<ol>
  <li>
    <article>
      <header>
        <h2>First Card Title</h2>
      </header>
      <p>This card contains important information related to the first item.</p>
      <footer>
        <a href="#">View Details</a>
      </footer>
    </article>
  </li>
  <li>
    <article>
      <header>
        <h2>Second Card Title</h2>
      </header>
      <p>This card contains important information related to the second item.</p>
      <footer>
        <a href="#">View Details</a>
      </footer>
    </article>
  </li>
</ol>
```

### Vue

```html
<ol>
  <li v-for="(item, index) in items" :key="item.id">
    <article>
      <header>
        <h2>{{ item.title }}</h2>
      </header>
      <p>{{ item.content }}</p>
      <footer>
        <router-link :to="item.link">{{ item.linkText }}</router-link>
      </footer>
    </article>
  </li>
</ol>
```

### Svelte

```svelte
<ol>
  {#each items as item (item.id)}
    <li>
      <article>
        <header>
          <h2>{item.title}</h2>
        </header>
        <p>{item.content}</p>
        <footer>
          <a href={item.link}>{item.linkText}</a>
        </footer>
      </article>
    </li>
  {/each}
</ol>
```

### Astro

```astro
<ol>
  {items.map(item => (
    <li key={item.id}>
      <article>
        <header>
          <h2>{item.title}</h2>
        </header>
        <p>{item.content}</p>
        <footer>
          <a href={item.link}>{item.linkText}</a>
        </footer>
      </article>
    </li>
  ))}
</ol>
```

---

## Data List

Key-value detail display using `dl`/`dt`/`dd`. Group related pairs; one `dl` can hold many `dt`/`dd` pairs — the snippet style uses one `dl` per pair for visual grouping flexibility.

### HTML / React

```html
<h2>Item Details</h2>
<dl>
  <dt>Property 1</dt>
  <dd>Value 1</dd>
</dl>
<dl>
  <dt>Property 2</dt>
  <dd>Value 2</dd>
</dl>
<dl>
  <dt>Property 3</dt>
  <dd>Value 3</dd>
</dl>
```

### Vue / Angular

```html
<h2>Item Details</h2>
<dl>
  <dt>Property 1</dt>
  <dd>{{ item.property1 }}</dd>
</dl>
<dl>
  <dt>Property 2</dt>
  <dd>{{ item.property2 }}</dd>
</dl>
<dl>
  <dt>Property 3</dt>
  <dd>{{ item.property3 }}</dd>
</dl>
```

### Svelte / Astro

```svelte
<h2>Item Details</h2>
<dl>
  <dt>Property 1</dt>
  <dd>{item.property1}</dd>
</dl>
<dl>
  <dt>Property 2</dt>
  <dd>{item.property2}</dd>
</dl>
<dl>
  <dt>Property 3</dt>
  <dd>{item.property3}</dd>
</dl>
```

---

## Checkbox List

Grouped checkboxes. Always wrap in `fieldset` with a `legend` so screen readers announce the group context. Each checkbox needs a unique `id` matched by its label's `for`.

### HTML / Astro

```html
<fieldset>
  <legend>Options</legend>
  <p>
    <input type="checkbox" id="option1" />
    <label for="option1">First Option</label>
  </p>
  <p>
    <input type="checkbox" id="option2" />
    <label for="option2">Second Option</label>
  </p>
  <p>
    <input type="checkbox" id="option3" />
    <label for="option3">Third Option</label>
  </p>
</fieldset>
```

### React

```jsx
<fieldset>
  <legend>Options</legend>
  <p>
    <input type="checkbox" id="option1" />
    <label htmlFor="option1">First Option</label>
  </p>
  <p>
    <input type="checkbox" id="option2" />
    <label htmlFor="option2">Second Option</label>
  </p>
  <p>
    <input type="checkbox" id="option3" />
    <label htmlFor="option3">Third Option</label>
  </p>
</fieldset>
```

### Vue

```html
<fieldset>
  <legend>Options</legend>
  <p>
    <input type="checkbox" id="option1" v-model="selectedOptions" value="option1" />
    <label for="option1">First Option</label>
  </p>
  <p>
    <input type="checkbox" id="option2" v-model="selectedOptions" value="option2" />
    <label for="option2">Second Option</label>
  </p>
  <p>
    <input type="checkbox" id="option3" v-model="selectedOptions" value="option3" />
    <label for="option3">Third Option</label>
  </p>
</fieldset>
```

### Angular

```html
<fieldset>
  <legend>Options</legend>
  <p>
    <input type="checkbox" id="option1" [(ngModel)]="option1" name="option1" />
    <label for="option1">First Option</label>
  </p>
  <p>
    <input type="checkbox" id="option2" [(ngModel)]="option2" name="option2" />
    <label for="option2">Second Option</label>
  </p>
  <p>
    <input type="checkbox" id="option3" [(ngModel)]="option3" name="option3" />
    <label for="option3">Third Option</label>
  </p>
</fieldset>
```

### Svelte

```svelte
<fieldset>
  <legend>Options</legend>
  <p>
    <input type="checkbox" id="option1" bind:group={selectedOptions} value="option1" />
    <label for="option1">First Option</label>
  </p>
  <p>
    <input type="checkbox" id="option2" bind:group={selectedOptions} value="option2" />
    <label for="option2">Second Option</label>
  </p>
  <p>
    <input type="checkbox" id="option3" bind:group={selectedOptions} value="option3" />
    <label for="option3">Third Option</label>
  </p>
</fieldset>
```

---

## Form Basic

Standard form with labeled text/email fields and a submit button. Each field is a `p` containing label + input; ids are stable and match the `name`.

### HTML / Astro

```html
<h2>Contact Form</h2>
<form action="#" method="post">
  <p>
    <label for="firstname">First Name</label>
    <input type="text" id="firstname" name="firstname" />
  </p>
  <p>
    <label for="lastname">Last Name</label>
    <input type="text" id="lastname" name="lastname" />
  </p>
  <p>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" />
  </p>
  <p>
    <button type="submit">Submit</button>
  </p>
</form>
```

### React

```jsx
<h2>Contact Form</h2>
<form action="#" method="post">
  <p>
    <label htmlFor="firstname">First Name</label>
    <input type="text" id="firstname" name="firstname" />
  </p>
  <p>
    <label htmlFor="lastname">Last Name</label>
    <input type="text" id="lastname" name="lastname" />
  </p>
  <p>
    <label htmlFor="email">Email</label>
    <input type="email" id="email" name="email" />
  </p>
  <p>
    <button type="submit">Submit</button>
  </p>
</form>
```

### Vue

```html
<h2>Contact Form</h2>
<form @submit.prevent="submitForm">
  <p>
    <label for="firstname">First Name</label>
    <input type="text" id="firstname" v-model="form.firstname" />
  </p>
  <p>
    <label for="lastname">Last Name</label>
    <input type="text" id="lastname" v-model="form.lastname" />
  </p>
  <p>
    <label for="email">Email</label>
    <input type="email" id="email" v-model="form.email" />
  </p>
  <p>
    <button type="submit">Submit</button>
  </p>
</form>
```

### Angular

```html
<h2>Contact Form</h2>
<form (ngSubmit)="onSubmit()" #contactForm="ngForm">
  <p>
    <label for="firstname">First Name</label>
    <input type="text" id="firstname" name="firstname" [(ngModel)]="model.firstname" />
  </p>
  <p>
    <label for="lastname">Last Name</label>
    <input type="text" id="lastname" name="lastname" [(ngModel)]="model.lastname" />
  </p>
  <p>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" [(ngModel)]="model.email" />
  </p>
  <p>
    <button type="submit">Submit</button>
  </p>
</form>
```

### Svelte

```svelte
<h2>Contact Form</h2>
<form on:submit|preventDefault={submitForm}>
  <p>
    <label for="firstname">First Name</label>
    <input type="text" id="firstname" bind:value={form.firstname} />
  </p>
  <p>
    <label for="lastname">Last Name</label>
    <input type="text" id="lastname" bind:value={form.lastname} />
  </p>
  <p>
    <label for="email">Email</label>
    <input type="email" id="email" bind:value={form.email} />
  </p>
  <p>
    <button type="submit">Submit</button>
  </p>
</form>
```

---

## Form Validation Inline

Per-field error messages shown next to the field. Wire the error element to the input with `aria-describedby` and make the error container `aria-live="assertive"` so screen readers announce new errors. Show/hide errors on blur/submit, not on every keystroke.

### HTML / Astro

```html
<h2>Contact Form with Validation</h2>
<form action="#" method="post">
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" name="firstname" aria-describedby="firstname_error" required />
    <span id="firstname_error" aria-live="assertive">First name is required.</span>
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" name="lastname" aria-describedby="lastname_error" required />
    <span id="lastname_error" aria-live="assertive">Last name is required.</span>
  </p>
  <p>
    <label for="email">Email (required)</label>
    <input type="email" id="email" name="email" aria-describedby="email_error" required />
    <span id="email_error" aria-live="assertive">Valid email is required.</span>
  </p>
  <p>
    <button type="submit">Submit</button>
  </p>
</form>
```

### React

```jsx
<h2>Contact Form with Validation</h2>
<form action="#" method="post">
  <p>
    <label htmlFor="firstname">First Name (required)</label>
    <input type="text" id="firstname" name="firstname" aria-describedby="firstname_error" required />
    <span id="firstname_error" aria-live="assertive">First name is required.</span>
  </p>
  <p>
    <label htmlFor="lastname">Last Name (required)</label>
    <input type="text" id="lastname" name="lastname" aria-describedby="lastname_error" required />
    <span id="lastname_error" aria-live="assertive">Last name is required.</span>
  </p>
  <p>
    <label htmlFor="email">Email (required)</label>
    <input type="email" id="email" name="email" aria-describedby="email_error" required />
    <span id="email_error" aria-live="assertive">Valid email is required.</span>
  </p>
  <p>
    <button type="submit">Submit</button>
  </p>
</form>
```

### Vue (Vuelidate-style)

```html
<h2>Contact Form with Validation</h2>
<form @submit.prevent="submitForm">
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" v-model="form.firstname" :class="{ 'error': v$.firstname.$error }" required />
    <span v-if="v$.firstname.$error" id="firstname_error" aria-live="assertive">First name is required.</span>
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" v-model="form.lastname" :class="{ 'error': v$.lastname.$error }" required />
    <span v-if="v$.lastname.$error" id="lastname_error" aria-live="assertive">Last name is required.</span>
  </p>
  <p>
    <label for="email">Email (required)</label>
    <input type="email" id="email" v-model="form.email" :class="{ 'error': v$.email.$error }" required />
    <span v-if="v$.email.$error" id="email_error" aria-live="assertive">Valid email is required.</span>
  </p>
  <p>
    <button type="submit" :disabled="v$.$invalid">Submit</button>
  </p>
</form>
```

### Angular (template-driven)

```html
<h2>Contact Form with Validation</h2>
<form (ngSubmit)="onSubmit()" #contactForm="ngForm">
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" name="firstname" [(ngModel)]="model.firstname" required #firstname="ngModel" />
    <span id="firstname_error" aria-live="assertive" *ngIf="firstname.invalid && (firstname.dirty || firstname.touched)">First name is required.</span>
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" name="lastname" [(ngModel)]="model.lastname" required #lastname="ngModel" />
    <span id="lastname_error" aria-live="assertive" *ngIf="lastname.invalid && (lastname.dirty || lastname.touched)">Last name is required.</span>
  </p>
  <p>
    <label for="email">Email (required)</label>
    <input type="email" id="email" name="email" [(ngModel)]="model.email" required email #email="ngModel" />
    <span id="email_error" aria-live="assertive" *ngIf="email.invalid && (email.dirty || email.touched)">Valid email is required.</span>
  </p>
  <p>
    <button type="submit" [disabled]="!contactForm.form.valid">Submit</button>
  </p>
</form>
```

### Svelte

```svelte
<h2>Contact Form with Validation</h2>
<form on:submit|preventDefault={submitForm}>
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" bind:value={form.firstname} required aria-describedby="firstname_error" />
    {#if errors.firstname}
      <span id="firstname_error" aria-live="assertive">First name is required.</span>
    {/if}
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" bind:value={form.lastname} required aria-describedby="lastname_error" />
    {#if errors.lastname}
      <span id="lastname_error" aria-live="assertive">Last name is required.</span>
    {/if}
  </p>
  <p>
    <label for="email">Email (required)</label>
    <input type="email" id="email" bind:value={form.email} required aria-describedby="email_error" />
    {#if errors.email}
      <span id="email_error" aria-live="assertive">Valid email is required.</span>
    {/if}
  </p>
  <p>
    <button type="submit" disabled={hasErrors}>Submit</button>
  </p>
</form>
```

---

## Form Validation Summary

Error summary above the form linking to each invalid field. The summary is a `section[role=alert]` containing anchor links (`href="#field_id"`) that focus the corresponding input. Combine with inline errors for the best UX.

### HTML / Astro

```html
<h2>Contact Form with Validation Summary</h2>
<section role="alert">
  <h3>Please correct the following errors</h3>
  <ul>
    <li><a href="#firstname" id="firstname_error">First name is required.</a></li>
    <li><a href="#lastname" id="lastname_error">Last name is required.</a></li>
    <li><a href="#email" id="email_error">Valid email is required.</a></li>
  </ul>
</section>
<form action="#" method="post">
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" name="firstname" aria-describedby="firstname_error" required />
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" name="lastname" aria-describedby="lastname_error" required />
  </p>
  <p>
    <label for="email">Email (required)</label>
    <input type="email" id="email" name="email" aria-describedby="email_error" required />
  </p>
  <p>
    <button type="submit">Submit</button>
  </p>
</form>
```

### React

```jsx
<h2>Contact Form with Validation Summary</h2>
<section role="alert">
  <h3>Please correct the following errors</h3>
  <ul>
    <li><a href="#firstname" id="firstname_error">First name is required.</a></li>
    <li><a href="#lastname" id="lastname_error">Last name is required.</a></li>
    <li><a href="#email" id="email_error">Valid email is required.</a></li>
  </ul>
</section>
<form action="#" method="post">
  <p>
    <label htmlFor="firstname">First Name (required)</label>
    <input type="text" id="firstname" name="firstname" aria-describedby="firstname_error" required />
  </p>
  <p>
    <label htmlFor="lastname">Last Name (required)</label>
    <input type="text" id="lastname" name="lastname" aria-describedby="lastname_error" required />
  </p>
  <p>
    <label htmlFor="email">Email (required)</label>
    <input type="email" id="email" name="email" aria-describedby="email_error" required />
  </p>
  <p>
    <button type="submit">Submit</button>
  </p>
</form>
```

### Vue

```html
<h2>Contact Form with Validation Summary</h2>
<section v-if="errors.length > 0" role="alert">
  <h3>Please correct the following errors</h3>
  <ul>
    <li v-for="(error, index) in errors" :key="index">
      <a :href="'#' + error.field">{{ error.message }}</a>
    </li>
  </ul>
</section>
<form @submit.prevent="submitForm">
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" v-model="form.firstname" required />
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" v-model="form.lastname" required />
  </p>
  <p>
    <label for="email">Email (required)</label>
    <input type="email" id="email" v-model="form.email" required />
  </p>
  <p>
    <button type="submit" :disabled="isInvalid">Submit</button>
  </p>
</form>
```

### Angular

```html
<h2>Contact Form with Validation Summary</h2>
<section role="alert" *ngIf="formErrors.length > 0">
  <h3>Please correct the following errors</h3>
  <ul>
    <li *ngFor="let error of formErrors">
      <a [href]="'#' + error.field">{{ error.message }}</a>
    </li>
  </ul>
</section>
<form (ngSubmit)="onSubmit()" #contactForm="ngForm">
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" name="firstname" [(ngModel)]="model.firstname" required #firstname="ngModel" />
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" name="lastname" [(ngModel)]="model.lastname" required #lastname="ngModel" />
  </p>
  <p>
    <label for="email">Email (required)</label>
    <input type="email" id="email" name="email" [(ngModel)]="model.email" required email #email="ngModel" />
  </p>
  <p>
    <button type="submit" [disabled]="!contactForm.form.valid">Submit</button>
  </p>
</form>
```

### Svelte

```svelte
<h2>Contact Form with Validation Summary</h2>
{#if errors.length > 0}
  <section role="alert">
    <h3>Please correct the following errors</h3>
    <ul>
      {#each errors as error}
        <li><a href="#{error.field}">{error.message}</a></li>
      {/each}
    </ul>
  </section>
{/if}
<form on:submit|preventDefault={submitForm}>
  <p>
    <label for="firstname">First Name (required)</label>
    <input type="text" id="firstname" bind:value={form.firstname} required aria-describedby="firstname_error" />
  </p>
  <p>
    <label for="lastname">Last Name (required)</label>
    <input type="text" id="lastname" bind:value={form.lastname} required aria-describedby="lastname_error" />
  </p>
  <p>
    <label for="email">Email (required)</label>
    <input type="email" id="email" bind:value={form.email} required aria-describedby="email_error" />
  </p>
  <p>
    <button type="submit" disabled={hasErrors}>Submit</button>
  </p>
</form>
```

---

## Login Form

Auth form wrapped in `article` with a `header` title and `footer` recovery links. Use `autocomplete="username"` and `autocomplete="current-password"` so password managers work.

### HTML / Astro

```html
<article>
  <header>
    <h2>Login</h2>
  </header>
  <form action="#" method="post">
    <p>
      <label for="username">Username</label>
      <input type="text" id="username" name="username" autocomplete="username" />
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" autocomplete="current-password" />
    </p>
    <p>
      <button type="submit">Sign In</button>
    </p>
  </form>
  <footer>
    <a href="/register">Create Account</a> | <a href="/forgot-password">Forgot Password</a>
  </footer>
</article>
```

### React

```jsx
<article>
  <header>
    <h2>Login</h2>
  </header>
  <form action="#" method="post">
    <p>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" name="username" autoComplete="username" />
    </p>
    <p>
      <label htmlFor="password">Password</label>
      <input type="password" id="password" name="password" autoComplete="current-password" />
    </p>
    <p>
      <button type="submit">Sign In</button>
    </p>
  </form>
  <footer>
    <a href="/register">Create Account</a> | <a href="/forgot-password">Forgot Password</a>
  </footer>
</article>
```

### Vue

```html
<article>
  <header>
    <h2>Login</h2>
  </header>
  <form @submit.prevent="login">
    <p>
      <label for="username">Username</label>
      <input type="text" id="username" v-model="credentials.username" autocomplete="username" required />
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" id="password" v-model="credentials.password" autocomplete="current-password" required />
    </p>
    <p>
      <button type="submit">Sign In</button>
    </p>
  </form>
  <footer>
    <router-link to="/register">Create Account</router-link> | <router-link to="/forgot-password">Forgot Password</router-link>
  </footer>
</article>
```

### Angular

```html
<article>
  <header>
    <h2>Login</h2>
  </header>
  <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
    <p>
      <label for="username">Username</label>
      <input type="text" id="username" name="username" [(ngModel)]="model.username" required />
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" [(ngModel)]="model.password" required />
    </p>
    <p>
      <button type="submit" [disabled]="!loginForm.form.valid">Sign In</button>
    </p>
  </form>
  <footer>
    <a [routerLink]="['/register']">Create Account</a> | <a [routerLink]="['/forgot-password']">Forgot Password</a>
  </footer>
</article>
```

### Svelte

```svelte
<article>
  <header>
    <h2>Login</h2>
  </header>
  <form on:submit|preventDefault={login}>
    <p>
      <label for="username">Username</label>
      <input type="text" id="username" bind:value={credentials.username} autocomplete="username" required />
    </p>
    <p>
      <label for="password">Password</label>
      <input type="password" id="password" bind:value={credentials.password} autocomplete="current-password" required />
    </p>
    <p>
      <button type="submit">Sign In</button>
    </p>
  </form>
  <footer>
    <a href="/register">Create Account</a> | <a href="/forgot-password">Forgot Password</a>
  </footer>
</article>
```

---

## Accordion

Expandable sections using native `details`/`summary` — keyboard accessible and functional with zero JavaScript. Only add a wrapper `div.accordion` if styling requires it.

### HTML / React / Angular

```html
<div class="accordion">
  <details>
    <summary>Section 1 Title</summary>
    <div class="accordion-content">
      <p>Content for section 1.</p>
    </div>
  </details>
  <details>
    <summary>Section 2 Title</summary>
    <div class="accordion-content">
      <p>Content for section 2.</p>
    </div>
  </details>
</div>
```

React variant: `className="accordion"` / `className="accordion-content"`.

### Vue

```html
<div class="accordion">
  <details v-for="(item, index) in accordionItems" :key="index">
    <summary>{{ item.title }}</summary>
    <div class="accordion-content">
      <p>{{ item.content }}</p>
    </div>
  </details>
</div>
```

### Svelte

```svelte
<div class="accordion">
  {#each accordionItems as item, index (item.id)}
    <details>
      <summary>{item.title}</summary>
      <div class="accordion-content">
        <p>{item.content}</p>
      </div>
    </details>
  {/each}
</div>
```

### Astro

```astro
<div class="accordion">
  {items.map(item => (
    <details>
      <summary>{item.title}</summary>
      <div class="accordion-content">
        <p>{item.content}</p>
      </div>
    </details>
  ))}
</div>
```

---

## Accessibility Checklist (apply to every generated component)

- [ ] Every `input`/`select`/`textarea` has a real `<label for>` (not just placeholder text)
- [ ] Checkbox/radio groups are wrapped in `fieldset` with a `legend`
- [ ] Validation messages are linked via `aria-describedby` and announced with `aria-live`
- [ ] Error summaries use `role="alert"` and link to the offending fields
- [ ] `nav` elements have an accessible name if there are multiple on a page (`aria-label`)
- [ ] Interactive elements are native (`button`, `a`, `details`) before reaching for ARIA
- [ ] Autocomplete attributes are set on auth forms (`username`, `current-password`)
