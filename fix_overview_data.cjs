const fs = require('fs');
let code = fs.readFileSync('src/components/Overview.tsx', 'utf8');

// Replace useState<any>(null) with lazy init from localStorage
code = code.replace(
  'const [data, setData] = useState<any>(null);',
  `const [data, setData] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('overviewData');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });`
);

// Add localStorage.setItem to the handleScan success block
code = code.replace(
  'setData(result);',
  `setData(result);
        localStorage.setItem('overviewData', JSON.stringify(result));`
);

fs.writeFileSync('src/components/Overview.tsx', code);
console.log('Fixed Overview data persistence');
