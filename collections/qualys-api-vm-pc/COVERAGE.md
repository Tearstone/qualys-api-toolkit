# Qualys API (VM/PC) coverage register

## Purpose

This register is the implementation inventory for the first Postman collection. It is based on the released source identified in [docs/sources.md](../../docs/sources.md). It records API families before individual endpoints and parameters are cataloged.

**Important:** Every row below is **planned**. It does not mean the corresponding requests have been created, imported into Postman, or live-verified.

## Status vocabulary

- **Planned** - family identified from the source guide; endpoint catalog has not started.
- **Cataloging** - endpoints, versions, and parameters are being transcribed and reviewed.
- **Built** - requests have been generated or authored in the Postman collection.
- **Imported** - the collection has imported successfully in Postman.
- **Live verified** - exercised against an authorized subscription without committing tenant data.

## Family-level inventory

| Area | Included guide sections | PDF pages | Status |
| --- | --- | ---: | --- |
| Shared platform | API conventions, API lifecycle, authentication, session APIs, IdP token authentication | 11-35 | Cataloging - authentication requests built; import and live verification pending |
| Scans | VM, compliance, SCAP, cloud perimeter/internal scans, schedules, parameters, summaries, scanner details, discovery scans | 37-197 | Planned |
| Scan configuration | Scanner appliances, VLANs/routes, imports/exports, VM/PCI/compliance option profiles, containerized scanner appliances | 198-604 | Planned |
| KnowledgeBase and search lists | KnowledgeBase versions, QVS JSON, vulnerability editing, static/dynamic search lists, vendor IDs/references | 477-593 | Planned |
| Scan authentication and vaults | Authentication-record types and vault management | 605-982 | Planned |
| Assets | IPs, hosts, detections, excluded/virtual/restricted hosts, asset groups, purge, patches, IPv6 assets | 983-1356 | Cataloging - IP form operations, Host List V2-V6, and Host Update V2 built; CSV variants and remaining host operations pending |
| Networks | Networks and scanner assignment | 1357-1362 | Planned |
| Reports and templates | Reports, report templates, scheduled reports, scorecards, downloads, VM/PCI/patch/map templates | 1363-1558 | Planned |
| VM remediation | Remediation tickets and ignore-vulnerability operations | 1559-1577 | Planned |
| Policy Audit / Compliance | Controls, policies, imports/exports, frameworks, posture, exceptions, SCAP, PCAS and library policies | 1578-2000 | Planned |
| Users and activity | User lifecycle, password changes, EULA, activation, activity-log export | 2001-2025 | Planned |
| Reference material | XML/DTD reference, ports, JSON scan result, error codes, streaming sample | 2026-2046 | Reference only |

## Cataloging order

The collection will be cataloged in a safe, customer-oriented sequence:

1. Shared platform and authentication
2. Assets and host detections
3. KnowledgeBase and search lists
4. Scans and scan configuration
5. Reports and VM remediation
6. Policy Audit / Compliance
7. Scan authentication, vaults, networks, and users

Destructive or tenant-changing requests will be included only after their read-only counterparts are cataloged and will be clearly marked in the eventual collection.

## Next detail level

For each family, add an endpoint-version table with these fields:

| Operation | Method | Path | Version | Lifecycle status | EOS | EOL | Replacement path | Parameters complete | PDF pages | HTML link | Lifecycle source | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

No row may claim parameter completeness until every documented input parameter has been reviewed. No row may claim a lifecycle status until it has been checked against the official [EOS/EOL timeline](../../docs/api-lifecycle.md).
