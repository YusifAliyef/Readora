/**
 * İki tarix arasındakı gün fərqini hesablayır
 * @param {Date} date1 - Birinci tarix (məsələn: son qaytarma tarixi)
 * @param {Date} date2 - İkinci tarix (məsələn: faktiki qaytarma tarixi)
 * @returns {number} Gün sayı
 */
const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const timeDiff = d2.getTime() - d1.getTime();

  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff > 0 ? daysDiff : 0;
};

module.exports = { getDaysDifference };
