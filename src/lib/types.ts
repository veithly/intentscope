export type ChainInfo = {
  chainId: string;
  chainType: string;
  name: string;
  isActive?: boolean;
};

export type TokenInfo = {
  symbol: string | null;
  name: string | null;
  address: string;
  decimals: number;
};

export type LifiRoute = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  minAmount: number | string;
  maxAmount: number | string;
  fee: number | string;
  gasFee: number | string;
  isActive: boolean;
  fromChain: ChainInfo | null;
  toChain: ChainInfo | null;
  fromToken: TokenInfo;
  toToken: TokenInfo;
};

export type QuotePreviewAsset = {
  user?: string;
  receiver?: string;
  asset: string;
  amount?: string;
};

export type LifiQuote = {
  order: unknown;
  validUntil: number;
  quoteId: string;
  preview: {
    inputs: QuotePreviewAsset[];
    outputs: QuotePreviewAsset[];
  };
  metadata?: Record<string, unknown>;
  partialFill: boolean;
  failureHandling: string;
};

export type FieldNote = {
  field: string;
  title: string;
  description: string;
};

export type TraceStep = {
  id: string;
  label: string;
  detail: string;
  status: "complete" | "current" | "waiting";
};

export type TraceRecord = {
  id: string;
  createdAt: string;
  endpoint: string;
  requestBody: unknown;
  response: {
    quotes: LifiQuote[];
  };
  quote: LifiQuote | null;
  fieldNotes: FieldNote[];
  steps: TraceStep[];
  source: "production-quote" | "no-quote";
};

export type RouteSnapshot = {
  fetchedAt: string;
  routes: LifiRoute[];
};
