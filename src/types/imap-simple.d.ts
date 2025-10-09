declare module 'imap-simple' {
  export interface ImapSimpleOptions {
    imap: {
      user: string;
      password: string;
      host: string;
      port: number;
      tls?: boolean;
      authTimeout?: number;
      connTimeout?: number;
    };
    onmail?: (numNewMail: number) => void;
  }

  export interface Message {
    attributes: any;
    parts: any[];
    envelope: any;
    body?: any;
    seqno: number;
    uid: number;
  }

  export interface SearchCriteria {
    [key: string]: any;
  }

  export interface Connection {
    openBox(boxName: string): Promise<any>;
    search(criteria: SearchCriteria, fetchOptions?: any): Promise<Message[]>;
    getPartData(msg: Message, partID: string): Promise<string>;
    addFlags(uid: number[], flags: string[]): Promise<void>;
    end(): void;
  }

  export function connect(options: ImapSimpleOptions): Promise<Connection>;
}