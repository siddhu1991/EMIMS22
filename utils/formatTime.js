import { format, getTime, formatDistanceToNow, isValid } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
  if (date != '') {
    return format(new Date(date), 'dd MMMM yyyy');
  } else {
    return '';
  }
}

export function fDBDate(date) {

  if (date != '') {
    const formatedDate = new Date(date);
    return formatedDate.toISOString();
  } else {
    return '';
  }
}

export function fDateTime(date) {
  if (date != '') {
    return format(new Date(date), 'dd MMM yyyy p');
  } else {
    return '';
  }
}

export function fTimestamp(date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
