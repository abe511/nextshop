// converts current date to locale date string
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US');
}

export default formatDate;
