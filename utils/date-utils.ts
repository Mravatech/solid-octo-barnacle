import moment from 'moment-timezone';


export const formattedDate = (date: Date) => {
  return moment(date).tz('Asia/Riyadh').format('YYYY-MM-DDTHH:mm:ss.SSSZ');
};
