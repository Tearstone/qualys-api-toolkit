# Shared authentication endpoint register

Source baseline: *Qualys API (VM and PA) User Guide*, version 10.40, pages 25-35. Current maintenance source: [Authentication to Qualys Account](https://docs.qualys.com/en/vm/qweb-all-api/get_started/authentication.htm). Lifecycle source reviewed 2026-09-20: [API Life Cycle - EOS/EOL](https://docs.qualys.com/en/vm/qweb-all-api/get_started/api_versioning_standards.htm).

## Authentication approaches

| Approach | Collection treatment | Guide pages | Lifecycle status |
| --- | --- | ---: | --- |
| Basic HTTP authentication | Default collection authentication, using `{{username}}` and `{{password}}` over HTTPS | 25 | No published lifecycle date |
| Session-based authentication | `Session login` and `Session logout` requests; Postman retains the session cookie during the active session | 26-31 | No published lifecycle date |
| IdP JWT authentication | Set `{{accessToken}}` in the local environment and change collection authentication to Bearer Token | 32-35 | No published lifecycle date |

The `X-Requested-With` header is required for API calls using Basic or session-based authentication. The template supplies it through `{{xRequestedWith}}`.

## Endpoint-version inventory

| Operation | Method | Path | Version | Lifecycle status | EOS | EOL | Replacement path | Parameters complete | PDF pages | HTML link | Lifecycle source | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- | --- |
| Session login | POST | `/api/2.0/fo/session/` | 2.0 | No published lifecycle date | Not published | Not published | Not published | Yes | 29-30 | [Authentication](https://docs.qualys.com/en/vm/qweb-all-api/get_started/authentication.htm) | [EOS/EOL timeline](https://docs.qualys.com/en/vm/qweb-all-api/get_started/api_versioning_standards.htm) | Built; import pending | Required: `action=login`, `username`, `password`. Optional: `echo_request={0|1}`. Uses form URL encoding. |
| Session logout | POST | `/api/2.0/fo/session/` | 2.0 | No published lifecycle date | Not published | Not published | Not published | Yes | 31 | [Authentication](https://docs.qualys.com/en/vm/qweb-all-api/get_started/authentication.htm) | [EOS/EOL timeline](https://docs.qualys.com/en/vm/qweb-all-api/get_started/api_versioning_standards.htm) | Built; import pending | Required: `action=logout`. Optional: `echo_request={0|1}`. Requires the active `QualysSession` cookie. |

## IdP token note

The guide shows a provider-specific token-generation request; its URL varies by identity provider and is not a Qualys API endpoint. Therefore, the collection does not include a misleading generic token-generation request. Customers set `{{accessToken}}` locally after obtaining their IdP-issued JWT, then select Bearer Token authentication at the collection level.

## Verification to complete

1. Import the collection into Postman.
2. Confirm that the login response sets a cookie in Postman's cookie manager.
3. Confirm logout succeeds with that cookie in the same Postman session.
4. Confirm Basic and IdP JWT authentication against an authorized subscription without committing any tenant data.
