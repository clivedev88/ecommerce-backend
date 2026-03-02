// function serialize(data) {
//   return JSON.parse(JSON.stringify(data, (key, value) => 
//     typeof value === 'bigint' ? Number(value) : value
//   ));
// }

// module.exports = serialize;

// src/shared/utils/serialize.js
function serialize(data) {
  return JSON.parse(JSON.stringify(data, (key, value) => {
    // Converte BigInt para Number
    if (typeof value === 'bigint') return Number(value);
    
    // Converte Date para formato brasileiro
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]; // Retorna apenas YYYY-MM-DD
    }
    
    return value;
  }));
}

module.exports = serialize;