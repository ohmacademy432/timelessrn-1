const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "dist", "index.html");
let html = fs.readFileSync(file, "utf-8");

const ogTags = `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Timeless RN Wellness Spa" />
    <meta property="og:title" content="Timeless RN Wellness Spa" />
    <meta property="og:description" content="Medical precision meets spa-level comfort. Your wellness is an experience, not a chore. West Nashville — est. 2017." />
    <meta property="og:url" content="https://timelessrn.com" />
    <meta property="og:image" content="https://timelessrn.com/assets/images/icon.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="458" />
    <meta property="og:image:height" content="393" />
    <meta property="og:image:alt" content="Timeless RN Wellness Spa" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Timeless RN Wellness Spa" />
    <meta name="twitter:description" content="Medical precision meets spa-level comfort. West Nashville — est. 2017." />
    <meta name="twitter:image" content="https://timelessrn.com/assets/images/icon.png" />
    <meta name="twitter:image:alt" content="Timeless RN Wellness Spa" />`;

html = html.replace("</head>", ogTags + "\n  </head>");

fs.writeFileSync(file, html, "utf-8");
console.log("OG meta tags injected into dist/index.html");
