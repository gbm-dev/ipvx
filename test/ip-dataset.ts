export const validAddresses = [
    // Standard IP addresses
    '192.168.1.1',
    '10.0.0.1',
    '172.16.0.1',
    '8.8.8.8',
    '1.2.3.4',
    '123.45.67.89',
    
    // Special addresses
    '0.0.0.0',
    '255.255.255.255',
    '127.0.0.1',
    
    // Edge cases (but still valid)
    '0.0.0.1',
    '1.1.1.1',
    '9.9.9.9',
    '11.11.11.11',
    '99.99.99.99',
    '100.100.100.100',
    '199.199.199.199',
    '201.202.203.204',
    '223.255.255.0',
    '224.0.0.1',
    '239.255.255.255',
    '255.255.255.254',
    
    // Minimum length (7 characters)
    '1.1.1.1',
    '0.0.0.0',
    
    // Maximum length (15 characters)
    '123.123.123.123',
    '255.255.255.255',
    
    // Leading zeros (valid but not preferred)
    // '192.168.001.001',
    // '010.000.000.001',
  ];
  
  export const invalidAddresses = [
    // Numbers out of range
    '256.0.0.1',
    '192.168.1.256',
    '300.300.300.300',
    '-1.2.3.4',
    
    // Incorrect number of octets
    '192.168.1',
    '192.168.1.1.1',
    '1.2.3',
    '1.2.3.4.5',
    
    // Non-numeric characters
    '192.168.1.a',
    'a.b.c.d',
    '1.2.3.4a',
    
    // Whitespace issues
    ' 192.168.1.1',
    '192.168.1.1 ',
    '192. 168.1.1',
    
    // Formatting issues
    '192.168..1',
    '.192.168.1.1',
    '192.168.1.1.',
    '192.168.01.1',
    '192.168.1.001',
    '0192.168.1.1',
    
    // Empty parts
    '...',
    '1...1',
    '1..2.3',
    
    // Completely invalid formats
    'not an ip',
    '192/168/1/1',
    '192:168:1:1',
    'localhost',
    
    // Valid-looking but semantically incorrect
    '0.0.0.256',
    '255.255.255.256',
    '256.256.256.256',
    
    // Length issues (below 7 or above 15 characters)
    '1.1.1',
    '192.168.0.00001',
    '1234.123.123.123',
    '1.12345.1.12345',
    
    // Hexadecimal notation (invalid for IPv4)
    '0xC0.0xA8.0x01.0x01',
    
    // Octal notation (invalid for IPv4)
    '0300.0250.0001.0001',
    
    // Binary notation (invalid for IPv4)
    '11000000.10101000.00000001.00000001',
    
    // Mixed notations (invalid)
    '192.168.0x01.1',
    '192.168.1.0377',
    
    // Invalid use of special addresses
    '255.255.255.256',
    '127.0.0.2',
    '169.254.0.1',
    
    // Invalid separators
    '192,168,1,1',
    '192_168_1_1',
    // URL encoded
    '192%2E168%2E1%2E1',
    '%31%39%32%2E%31%36%38%2E%31%2E%31',
    
    // Unicode representations
    '１９２。１６８。１。１', // Full-width characters
    '192。168。1。1',  // Ideographic full stop as separator
    
    // Octal encoding (invalid in modern browsers, but worth testing)
    '0300.0250.0001.0001',
    
    // Hexadecimal encoding (invalid in modern browsers, but worth testing)
    '0xC0.0xA8.0x01.0x01',
    
    // Mixed encoding
    '192.0xa8.01.0001',
    
    // Potential 32-bit integer overflow
    '4294967296',  // 2^32, just over the maximum 32-bit unsigned integer
    '4294967295',  // Maximum 32-bit unsigned integer
    '-1',  // Might be interpreted as 255.255.255.255 if not properly handled
    
    // Potential 64-bit integer overflow
    '18446744073709551616',  // 2^64, just over the maximum 64-bit unsigned integer
    '18446744073709551615',  // Maximum 64-bit unsigned integer
    
    // Large numbers that could cause overflow in parsing
    '99999999999999999999999999999999999999',
    
    // Exponential notation (invalid for IP, but might trick parsers)
    '1e10.1e10.1e10.1e10',
    
    // Base64 encoded (invalid, but might be passed to trick systems)
    'MTkyLjE2OC4xLjE=',
    
    // HTML entity encoded
    '&#49;&#57;&#50;&#46;&#49;&#54;&#56;&#46;&#49;&#46;&#49;',
    
    // Punycode (not applicable for IPs, but worth testing)
    'xn--1-7sbf9ahchdtfg.1.1',
    
    // Excessive leading zeros (potentially exploitable in some systems)
    '000000192.000000168.000000001.000000001',
    
    // Unusual bases (invalid but might trick parsers)
    '0b11000000.0b10101000.0b00000001.0b00000001',  // Binary
    '0o300.0o250.0o001.0o001',  // Octal with prefix
    
    // Negative numbers in octets
    '192.-168.1.1',
    '192.168.-1.1',
    
    // Scientific notation (invalid for IP, but might trick parsers)
    '1.92e2.1.68e2',
    
    // Non-ASCII digits
    '١٩٢.١٦٨.١.١',  // Arabic digits
    '१९२.१६८.१.१',  // Devanagari digits
];
  
  export const allAddresses = [...validAddresses, ...invalidAddresses];