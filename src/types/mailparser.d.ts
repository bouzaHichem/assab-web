declare module 'mailparser' {
  export interface ParsedMail {
    headers: Map<string, string>;
    subject?: string;
    from?: {
      text: string;
      value: Array<{
        address: string;
        name: string;
      }>;
    };
    to?: {
      text: string;
      value: Array<{
        address: string;
        name: string;
      }>;
    };
    date?: Date;
    text?: string;
    html?: string;
    textAsHtml?: string;
    attachments?: Array<{
      filename?: string;
      contentType: string;
      content: Buffer;
      size: number;
    }>;
  }

  export function simpleParser(source: string | Buffer): Promise<ParsedMail>;
}