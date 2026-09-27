const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `import { Overview } from './components/Overview';
import { CompareHub } from './components/CompareHub';
import { BattlecardsList } from './components/BattlecardsList';
import { LiveSignals } from './components/LiveSignals';
import { SettingsUI } from './components/SettingsUI';
`;

content = content.replace(imports, '');
content = imports + '\n' + content;

fs.writeFileSync('src/App.tsx', content);
