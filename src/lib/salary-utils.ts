 /**
  * Format salary values to Indian currency format
  * Handles thousands (K), lakhs (L), and crores (Cr)
  * Database stores salary in lakhs for values < 1000, otherwise raw numbers
  */
 export function formatSalaryValue(value: number): string {
   // If value is less than 1000, assume it's already in lakhs
   if (value < 1000) {
     return `₹${value}L`;
   }
   
   // Otherwise, it's a raw number - convert to appropriate format
   const crore = 10000000; // 1 crore = 10 million
   const lakh = 100000;    // 1 lakh = 100 thousand
   const thousand = 1000;
   
   if (value >= crore) {
     const croreValue = value / crore;
     return `₹${croreValue % 1 === 0 ? croreValue.toFixed(0) : croreValue.toFixed(1)}Cr`;
   } else if (value >= lakh) {
     const lakhValue = value / lakh;
     return `₹${lakhValue % 1 === 0 ? lakhValue.toFixed(0) : lakhValue.toFixed(1)}L`;
   } else if (value >= thousand) {
     const thousandValue = value / thousand;
     return `₹${thousandValue % 1 === 0 ? thousandValue.toFixed(0) : thousandValue.toFixed(1)}K`;
   }
   
   return `₹${value}`;
 }
 
 /**
  * Format salary range for display
  */
 export function formatSalary(min: number | null, max: number | null): string {
   if (min === null && max === null) {
     return "Competitive";
   }
   
   if (min !== null && max !== null) {
     return `${formatSalaryValue(min)} - ${formatSalaryValue(max)}`;
   }
   
   if (min !== null) {
     return `${formatSalaryValue(min)}+`;
   }
   
   if (max !== null) {
     return `Up to ${formatSalaryValue(max)}`;
   }
   
   return "Competitive";
 }