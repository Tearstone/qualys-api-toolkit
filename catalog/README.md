# Catalog

This directory is the maintainer source of truth for endpoint coverage. It is deliberately structured data, not customer-facing documentation.

Each record identifies the operation, endpoint version, parameters, lifecycle status, and source evidence needed to maintain the Postman collection. Keep records grouped by API guide and resource family, such as `vm-pc/authentication.json` and `vm-pc/assets-ip.json`.

Build the current VM/PC collection with Node.js 18 or later:

```sh
node scripts/build-vm-pc-collection.mjs
```

The build validates the required catalog evidence before it writes the collection. Use `node scripts/build-vm-pc-collection.mjs --check` to confirm the generated collection is current. Commit the catalog and generated collection together; do not edit the generated collection directly.

The customer-facing artifacts remain the collection JSON, environment template, concise README, and changelog.
