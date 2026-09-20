# Contributing

Thank you for helping improve the Qualys API Toolkit.

## Scope

The current objective is complete, product-specific or guide-specific Postman collections. Start with Qualys API (VM/PC), which includes VMDR, Policy Audit, and shared-platform APIs. Do not add tenant automation, opinionated workflows, or tag-management tooling unless the project scope is updated.

## Source requirements

- Use current, released Qualys product API documentation as the source of truth.
- Record the source URL, document edition or publication date, and the review date for every operation.
- Do not infer a parameter, endpoint, or version from a sample request. Record documentation gaps for review instead.
- Do not copy vendor PDFs, credentials, tenant responses, or customer data into this repository.

## Collection requirements

Every published request must include:

- A clear product and API-family location.
- HTTP method and documented endpoint version.
- All documented input parameters, including required and optional parameters.
- Descriptions, expected value format, defaults, and permitted values where documented.
- Optional parameters disabled by default.
- Authentication and platform requirements.
- A documentation source and verification status.

Place requests that can create, modify, or delete tenant data in a clearly labeled area and keep them disabled unless a safe default request is possible.

## Catalog-first maintenance

Add or update operation metadata in `catalog/` before building the Postman collection. A catalog record captures the endpoint version, parameters, lifecycle details, source pages, and maintenance status. Run `node scripts/build-vm-pc-collection.mjs` after catalog changes, then commit the catalog and generated collection together. Do not add new `inventory/` Markdown files for individual API families or directly edit generated collection JSON.

## Before opening a pull request

1. Import the collection into Postman and confirm it loads without errors.
2. Check that the collection contains no credentials, tokens, customer identifiers, or tenant response data.
3. Update the relevant coverage notes and source register.
4. Describe what changed, the documentation reviewed, and any known gaps.
