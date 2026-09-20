# Source register

## Qualys API (VM/PC)

### Baseline catalog source

**Qualys API (VM and PA) User Guide, version 10.40, September 7, 2026** is the baseline used for the first coverage register. The supplied file contains 2,049 pages.

- Publisher PDF: <https://www.qualys.com/docs/qualys-api-vmpc-user-guide.pdf>
- Exact supplied-file SHA-256: `beda8ff92243a76181190baf9cda74cce5438153765e1937c8cede2db153e020`
- Reviewed: 2026-09-20

The publisher URL may serve a newer PDF later. The edition, date, and checksum identify the baseline actually reviewed. The PDF is not redistributed in this repository.

### Maintenance source

Use the official [Qualys VM and PA APIs HTML guide](https://docs.qualys.com/en/vm/qweb-all-api/) to identify published changes after the baseline edition. Record the HTML page URL and the review date against each affected request.

Use the official [API Life Cycle - EOS/EOL](https://docs.qualys.com/en/vm/qweb-all-api/get_started/api_versioning_standards.htm) page for endpoint-specific lifecycle dates and recommended replacement paths. It is reviewed independently because lifecycle dates can change between PDF editions.

### Excluded source

Do not use `developers.qualys.com` as an API-discovery or maintenance source for this project. It is under review and known to be incomplete.

## Source rules

1. Treat the released PDF as the versioned evidence for initial coverage.
2. Treat the official Qualys HTML guide as the maintenance source.
3. When the sources disagree, record the discrepancy in the coverage register. Do not silently guess which behavior is correct.
4. Do not commit vendor PDFs, credentials, tenant responses, or customer data.
