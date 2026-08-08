# Security

Do not place private videos, customer data, credentials, cookies, API keys,
browser profiles, `.env` files, or machine-specific absolute paths in issues or
pull requests.

Before publishing a generated project, run:

```bash
npm run verify:public
```

Report a suspected secret exposure privately to the repository owner. Do not
open a public issue containing the secret.
