import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "reference/api/trms-api",
    },
    {
      type: "category",
      label: "Matched Book",
      link: {
        type: "doc",
        id: "reference/api/matched-book",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/rebuild-projection",
          label: "Rebuild matched-book projection",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-matched-book",
          label: "Matched-book report",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Admin Users",
      link: {
        type: "doc",
        id: "reference/api/admin-users",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-3",
          label: "List registry users",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-4",
          label: "Pre-provision a registry user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/suspend",
          label: "Suspend a registry user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/reactivate",
          label: "Reactivate a registry user",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-1",
          label: "Get registry user by ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Pre-trade",
      link: {
        type: "doc",
        id: "reference/api/pre-trade",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/price",
          label: "Pre-trade price and risk",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/check",
          label: "Pre-trade what-if check",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Calendars",
      link: {
        type: "doc",
        id: "reference/api/calendars",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-calendar",
          label: "Get calendar by code",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/update-calendar-details",
          label: "Update calendar metadata",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/delete-calendar",
          label: "Delete a calendar",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/upload-holidays",
          label: "Upload holidays",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/check-business-day",
          label: "Check business day",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/adjust-date",
          label: "Adjust date to business day",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-calendars",
          label: "List all calendars",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/delete-holiday",
          label: "Delete a single holiday",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Configuration",
      link: {
        type: "doc",
        id: "reference/api/configuration",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/reload-schemas",
          label: "Reload schemas from filesystem",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/reload-roles",
          label: "Invalidate cached role/scope resolutions",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-stp-rules",
          label: "List STP rules",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/list-schemas",
          label: "List available schemas",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/check-schema-availability",
          label: "Check schema availability for a product type and asset class",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-schema-body",
          label: "Get raw JSON Schema document by product type / asset class / subtype",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/list-roles",
          label: "List available roles and their scopes",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/list-approval-chains",
          label: "List approval chain configurations",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "My Entitlements",
      link: {
        type: "doc",
        id: "reference/api/my-entitlements",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/portfolios",
          label: "Get effective resolved portfolio entitlements",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Books",
      link: {
        type: "doc",
        id: "reference/api/books",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-all-1",
          label: "List all books",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-2",
          label: "Create a book",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Parties",
      link: {
        type: "doc",
        id: "reference/api/parties",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-all",
          label: "List all parties",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-1",
          label: "Create a party",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-by-id-5",
          label: "Get a party by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/list-selectable-counterparties",
          label: "List selectable counterparties",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Closeout",
      link: {
        type: "doc",
        id: "reference/api/closeout",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/execute-closeout",
          label: "Execute a closeout",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-closeout-batches",
          label: "List closeout batches",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-closeout-batch",
          label: "Get a closeout batch by ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Bank Accounts",
      link: {
        type: "doc",
        id: "reference/api/bank-accounts",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-by-id",
          label: "Get a bank account by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/update-2",
          label: "Update a bank account's mutable fields",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/delete-2",
          label: "Deactivate (soft-delete) a bank account",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/list-by-legal-entity",
          label: "List bank accounts for a legal entity",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-3",
          label: "Create a bank account",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "System",
      link: {
        type: "doc",
        id: "reference/api/system",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/reload-config",
          label: "Reload all configuration",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/rebuild-projections",
          label: "Rebuild all projections from event store",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/status",
          label: "Get system status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/business-date",
          label: "Get current business date",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Reference Data",
      link: {
        type: "doc",
        id: "reference/api/reference-data",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/catalog",
          label: "Get refdata catalog",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/manifest",
          label: "Get refdata manifest",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Payments",
      link: {
        type: "doc",
        id: "reference/api/payments",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/send-1",
          label: "Send payment message to network",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/reject",
          label: "Reject payment message from the network",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/reject-cancellation",
          label: "Reject cancellation — bank refused (PMPG RJCR)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/pend-cancellation",
          label: "Pend cancellation — bank routed on (PMPG PDCR / PTNA)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/confirm-cancellation",
          label: "Confirm cancellation — bank accepted (PMPG CNCL)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/cancel-1",
          label: "Generate MT192 cancellation for payment",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/acknowledge",
          label: "Acknowledge payment with external reference",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/generate",
          label: "Generate a payment message for a settlement",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-by-id-4",
          label: "Get payment message by ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "User Preferences",
      link: {
        type: "doc",
        id: "reference/api/user-preferences",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/upsert",
          label: "Upsert user preference",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/list-5",
          label: "List user preferences",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Netting",
      link: {
        type: "doc",
        id: "reference/api/netting",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/net",
          label: "Net settlements",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-sets",
          label: "List netting sets",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-set-by-id",
          label: "Get netting set by ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Dev Auth",
      link: {
        type: "doc",
        id: "reference/api/dev-auth",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/mint-token",
          label: "Mint dev token",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Fixings",
      link: {
        type: "doc",
        id: "reference/api/fixings",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/query-fixings",
          label: "Query rate fixings",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/capture-fixing",
          label: "Capture a rate fixing",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Journals",
      link: {
        type: "doc",
        id: "reference/api/journals",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/reverse-journal-entry",
          label: "Reverse a journal entry",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/create-settlement-entry",
          label: "Create a settlement journal entry",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/close-period",
          label: "Close an accounting period",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-journal-entries",
          label: "List journal entries",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-journal-entry",
          label: "Get a journal entry by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/list-posting-rules",
          label: "List posting rules",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "AI Assistant",
      link: {
        type: "doc",
        id: "reference/api/ai-assistant",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-sessions",
          label: "List AI sessions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-session",
          label: "Start AI session",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/send-message",
          label: "Send message to AI agent",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/delete-session",
          label: "Close AI session",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/update-session",
          label: "Update AI session",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "reference/api/list-messages",
          label: "List AI session messages",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Compliance",
      link: {
        type: "doc",
        id: "reference/api/compliance",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-for-date",
          label: "List EOD compliance verdicts",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Simulations",
      link: {
        type: "doc",
        id: "reference/api/simulations",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-simulations",
          label: "List all simulations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-simulation",
          label: "Create simulation",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/run-simulation",
          label: "Run simulation",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/run-intraday-simulation",
          label: "Run intraday simulation",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/cancel-simulation",
          label: "Cancel running simulation",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-simulation",
          label: "Get simulation by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/delete-simulation",
          label: "Delete simulation",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/get-simulation-status",
          label: "Get simulation status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-simulation-results",
          label: "Get simulation results",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Workbench Templates",
      link: {
        type: "doc",
        id: "reference/api/workbench-templates",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get",
          label: "Read workbench template",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/update",
          label: "Update workbench template",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/delete",
          label: "Delete workbench template",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/list",
          label: "List workbench templates",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/save",
          label: "Save workbench template",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Coupon Schedule",
      link: {
        type: "doc",
        id: "reference/api/coupon-schedule",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-coupon-schedule",
          label: "Get coupon schedule for a bond deal",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Asset Class Extensions",
      link: {
        type: "doc",
        id: "reference/api/asset-class-extensions",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-by-code",
          label: "Get an asset class extension by code",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/update-1",
          label: "Update an asset class extension",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/delete-1",
          label: "Remove an asset class extension",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/list-2",
          label: "List all registered asset class extensions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/register",
          label: "Register a new asset class extension",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "EOD",
      link: {
        type: "doc",
        id: "reference/api/eod",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/trigger",
          label: "Trigger an EOD run",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/run-step",
          label: "Run a single EOD step synchronously",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/rerun",
          label: "Re-run a completed business date",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/catch-up",
          label: "Catch the business date up to a target date",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/status-1",
          label: "Get current EOD step status for a business date",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/runs",
          label: "Get EOD run attempts for a business date",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Cash Balances",
      link: {
        type: "doc",
        id: "reference/api/cash-balances",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-projected-balance",
          label: "Projected cash balance",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/list-balances",
          label: "List cash balances",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-balance",
          label: "Get cash balance by account and currency",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Cashflows",
      link: {
        type: "doc",
        id: "reference/api/cashflows",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/fix-cashflow",
          label: "Manually fix a floating-rate cashflow",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-cashflows-for-deal",
          label: "List cashflows for a deal",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Deals",
      link: {
        type: "doc",
        id: "reference/api/deals",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/query",
          label: "Query deals",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/capture",
          label: "Capture a new deal",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/terminate",
          label: "Terminate a deal",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/substitute-collateral",
          label: "Substitute collateral on a repo deal",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/close-open-repo",
          label: "Close an open repo",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/cancel-2",
          label: "Cancel a deal",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/pre-check",
          label: "Run pre-trade checks",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-by-id-1",
          label: "Get a deal by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/amend",
          label: "Amend a deal",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "reference/api/transition",
          label: "Transition deal status",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "reference/api/history",
          label: "Get deal event history",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Risk Limits",
      link: {
        type: "doc",
        id: "reference/api/risk-limits",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-1",
          label: "List risk limits",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create",
          label: "Create a risk limit",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/delete-3",
          label: "Delete a risk limit",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Curve Calibration",
      link: {
        type: "doc",
        id: "reference/api/curve-calibration",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-recipe",
          label: "Get active recipe",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/set-recipe",
          label: "Set curve recipe",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/calibrate",
          label: "Calibrate curve",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-calibrations",
          label: "List calibration runs",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Market Quotes",
      link: {
        type: "doc",
        id: "reference/api/market-quotes",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-quotes",
          label: "List market quotes",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/publish-quotes",
          label: "Publish market quotes",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Valuations",
      link: {
        type: "doc",
        id: "reference/api/valuations",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/valuate",
          label: "Valuate a deal",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-4",
          label: "List/search valuations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-by-id-2",
          label: "Get valuation by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-details",
          label: "Get valuation component breakdown",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-by-deal-id",
          label: "Get valuations for a deal",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Workbench Dev",
      link: {
        type: "doc",
        id: "reference/api/workbench-dev",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/bootstrap",
          label: "Bootstrap workbench reference data",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Market Indexes",
      link: {
        type: "doc",
        id: "reference/api/market-indexes",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-index",
          label: "Get market index by name",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/update-index",
          label: "Update market index",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/archive-index",
          label: "Archive market index",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/list-indexes",
          label: "List all market indexes",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-index",
          label: "Create market index",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-grid-points",
          label: "List grid points for an index",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/save-grid-points",
          label: "Save grid points for an index",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-grid-point-data",
          label: "Get grid point data for a date",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/publish-grid-point-data",
          label: "Publish grid point data",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/interpolate",
          label: "Interpolate index value at tenor",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/discount-factor-range",
          label: "Range of discount factors at day offsets",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/discount-factor",
          label: "Get discount factor at tenor",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "STP Rules",
      link: {
        type: "doc",
        id: "reference/api/stp-rules",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-rule",
          label: "Get STP rule by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/update-rule",
          label: "Update STP rule",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/disable-rule",
          label: "Disable STP rule",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/reorder-rules",
          label: "Reorder STP rules",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/list-rules",
          label: "List enabled STP rules",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-rule",
          label: "Create STP rule",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Audit",
      link: {
        type: "doc",
        id: "reference/api/audit",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/verify-chain",
          label: "Verify hash chain integrity for an aggregate",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/trace-lineage",
          label: "Trace lineage for a valuation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-event-history",
          label: "Get event history for an aggregate",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "JAR Calculator Keys",
      link: {
        type: "doc",
        id: "reference/api/jar-calculator-keys",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-keys",
          label: "List registered JAR signing keys",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/register-key",
          label: "Register a public key for JAR signing",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/revoke-key",
          label: "Revoke a registered public key",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Instruments",
      link: {
        type: "doc",
        id: "reference/api/instruments",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-instruments",
          label: "List instruments",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-instrument",
          label: "Create a financial instrument",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/supersede-instrument",
          label: "Supersede an instrument's financial terms",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-events",
          label: "List instrument lifecycle events",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/record-event",
          label: "Record an instrument lifecycle event",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-instrument",
          label: "Get an instrument by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/deactivate-instrument",
          label: "Deactivate an instrument",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/amend-instrument",
          label: "Administratively amend an instrument",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "reference/api/get-spread-history",
          label: "Get daily bond spread history",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-comparables",
          label: "Get comparable bond peers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/list-types",
          label: "List supported instrument types",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Portfolio",
      link: {
        type: "doc",
        id: "reference/api/portfolio",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-portfolio-risk",
          label: "Portfolio risk surface",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/list-positions",
          label: "List positions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-position",
          label: "Get position by ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Settlements",
      link: {
        type: "doc",
        id: "reference/api/settlements",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/settle",
          label: "Mark settlement as settled",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/send",
          label: "Send settlement",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/instruct",
          label: "Instruct settlement with SSI",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/cancel",
          label: "Cancel settlement",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-6",
          label: "List settlements",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-by-id-3",
          label: "Get settlement by ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Credit",
      link: {
        type: "doc",
        id: "reference/api/credit",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/get-line",
          label: "Get credit line by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/update-line",
          label: "Update credit line",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/list-lines",
          label: "List active credit lines",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-line",
          label: "Create credit line",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/suspend-line",
          label: "Suspend credit line",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-lines-by-counterparty",
          label: "Get credit lines by counterparty",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-exposure",
          label: "Get counterparty exposure",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Instructions",
      link: {
        type: "doc",
        id: "reference/api/instructions",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/create-instruction",
          label: "Create a deal instruction",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/execute-item",
          label: "Execute an instruction item",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/claim-item",
          label: "Claim an instruction item",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/claim-instruction",
          label: "Claim an instruction",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-instruction",
          label: "Get an instruction by ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Plugin Artifacts",
      link: {
        type: "doc",
        id: "reference/api/plugin-artifacts",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/list-all-2",
          label: "List all artifacts",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/upload",
          label: "Upload a new artifact",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/submit",
          label: "Submit artifact for review",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/retire",
          label: "Retire artifact",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/reject-1",
          label: "Reject artifact",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/deactivate",
          label: "Deactivate artifact",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/approve",
          label: "Approve artifact",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/activate",
          label: "Activate artifact",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-by-id-6",
          label: "Get artifact by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/list-versions",
          label: "List all versions of a named artifact",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Approvals",
      link: {
        type: "doc",
        id: "reference/api/approvals",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/reject-2",
          label: "Reject an approval request",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/escalate",
          label: "Escalate an approval request",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/approve-1",
          label: "Approve an approval request",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-approvals",
          label: "List approvals",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-approval",
          label: "Get an approval request by ID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Admin Entitlements",
      link: {
        type: "doc",
        id: "reference/api/admin-entitlements",
      },
      items: [
        {
          type: "doc",
          id: "reference/api/add-membership",
          label: "Add or keep a DATA-group membership",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/remove-membership",
          label: "Remove a DATA-group membership",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/add-functional-group-scope",
          label: "Grant a scope to a FUNCTIONAL group",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "reference/api/create-restricted-list-entry",
          label: "Add a counterparty or instrument to a restricted (MNPI) list",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-groups",
          label: "List DATA groups",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-group",
          label: "Create a DATA group",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-group-conflicts",
          label: "List declared SoD group conflicts",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-group-conflict",
          label: "Declare a separation-of-duties (SoD) conflict between two groups",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/list-grants",
          label: "List entitlement grants with filters",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/create-grant",
          label: "Create an entitlement grant (ALLOW or DENY)",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "reference/api/get-recertification-extract",
          label: "Periodic access-review (recertification) extract",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-group",
          label: "Get DATA group detail",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/delete-group",
          label: "Delete an empty DATA group",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/list-functional-groups",
          label: "List FUNCTIONAL groups and the scopes they grant",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/get-functional-group",
          label: "Get a FUNCTIONAL group and its scope bundle",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "reference/api/delete-restricted-list-entry",
          label: "Remove a restricted-list (DENY) entry",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/delete-group-conflict",
          label: "Remove a declared SoD group conflict",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/remove-functional-group-scope",
          label: "Revoke a scope from a FUNCTIONAL group",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "reference/api/revoke-grant",
          label: "Revoke an entitlement grant",
          className: "api-method delete",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
