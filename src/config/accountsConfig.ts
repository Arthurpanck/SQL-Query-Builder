import { FieldConfig } from '../engine/types';

export const accountsConfig: FieldConfig = {
  tableName: 'accounts',
  fields: [
    { id: 'ID', label: 'ID', type: 'number', column: 'ID' },
    { id: 'Email', label: 'Email', type: 'string', column: 'Email' },
    { id: 'First Name', label: 'First Name', type: 'string', column: 'First Name' },
    { id: 'Last Name', label: 'Last Name', type: 'string', column: 'Last Name' },
    {
      id: 'Plan', label: 'Plan', type: 'select', column: 'Plan',
      options: ['Basic', 'Business', 'Premium'],
    },
    {
      id: 'Source', label: 'Source', type: 'select', column: 'Source',
      options: ['Facebook', 'Google', 'Invite', 'Twitter'],
    },
    { id: 'Seats', label: 'Seats', type: 'number', column: 'Seats' },
    { id: 'Created At', label: 'Created At', type: 'date', column: 'Created At' },
    { id: 'Trial Ends At', label: 'Trial Ends At', type: 'date', column: 'Trial Ends At' },
    { id: 'Canceled At', label: 'Canceled At', type: 'date', column: 'Canceled At' },
    { id: 'Trial Converted', label: 'Trial Converted', type: 'boolean', column: 'Trial Converted' },
    { id: 'Active Subscription', label: 'Active Subscription', type: 'boolean', column: 'Active Subscription' },
    { id: 'Legacy Plan', label: 'Legacy Plan', type: 'boolean', column: 'Legacy Plan' },
    {
      id: 'Country', label: 'Country', type: 'select', column: 'Country',
      options: ['AE','AF','AG','AL','AM','AR','AT','AU','BA','BD','BE','BF','BG','BN','BO','BR','BT','BW','BY','CA','CD','CH','CI','CL','CM','CN','CO','CR','CU','CV','CY','CZ','DE','DK','DO','DZ','EE','EG','ES','ET','FI','FR','GB','GE','GM','GN','GR','GT','HN','HR','HT','HU','ID','IE','IL','IN','IQ','IR','IT','JM','JO','JP','KE','KH','KI','KM','KR','KZ','LA','LC','LK','LR','LS','LT','LU','LV','LY','MA','MD','MG','MK','ML','MM','MT','MU','MW','MX','MY','NE','NG','NI','NL','NO','NZ','PA','PE','PH','PK','PL','PT','PW','PY','RO','RS','RU','RW','SA','SE','SI','SK','SL','SM','SN','SO','SV','SY','SZ','TH','TJ','TN','TO','TR','TZ','UA','UG','US','UZ','VE','VN','YE','ZA','ZM','ZW'],
    },
  ],
};
