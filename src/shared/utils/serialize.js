function serialize(data) {
  if (!data) return data;
  
  return JSON.parse(JSON.stringify(data, (key, value) => {
    if (typeof value === 'bigint') return Number(value);
    
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    if (value && typeof value.toJSON === 'function') {
      return value.toJSON();
    }

    if (value === undefined) return null;
    
    return value;
  }));
}

module.exports = serialize;