declare module "mammoth" {
  interface ExtractRawTextResult {
    value: string;
    messages: unknown[];
  }
  function extractRawText(options: { buffer: Buffer }): Promise<ExtractRawTextResult>;
}
