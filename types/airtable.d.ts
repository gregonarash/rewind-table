type Credentials = {
  linkToTable: string;
  apiKey: string;
};

type Metadata = {
  tables: Table[];
};

type Table = {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: Field[];
  views: View[];
};

type Field = {
  type: string;
  id: string;
  name: string;
  options?: Options;
};

type Options = {
  durationFormat?: string;
  isReversed?: boolean;
  prefersSingleRecordLink?: boolean;
  linkedTableId?: string;
  viewIdForRecordSelection?: string;
  choices?: Choice[];
};

type Choice = {
  id: string;
  name: string;
  color?: string;
};

type View = {
  id: string;
  name: string;
  type: string;
};
