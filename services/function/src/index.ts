import { app } from '@azure/functions';
import './functions/processDocument.js'

app.setup({
    enableHttpStream: true,
});
