const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
const keep_alive = require('./keep_alive.js')

const dirPath = __dirname;
const savePath = `${dirPath}/save`;
const tablePath = `${dirPath}/table.html`;


function main() {
  axios.get('https://www.vizugy.hu/?mapModule=OpGrafikon&AllomasVOA=16495FDD-97AB-11D4-BB62-00508BA24287&mapData=OrasIdosor#mapData')
    .then(response => {
      const $ = cheerio.load(response.data);
      const table = $('.vizmercelista');

      const data = [];

      const cells = table.find('tr').eq(1).find('td').find('strong');
      const kValue = cells.eq(1).text().trim();
      axios.get('https://www.vizugy.hu/?mapModule=OpGrafikon&AllomasVOA=16495FDC-97AB-11D4-BB62-00508BA24287&mapData=OrasIdosor#mapData')
        .then(response => {
          const $ = cheerio.load(response.data);
          const table = $('.vizmercelista');
    
          const data = [];
    
          const cells = table.find('tr').eq(1).find('td');
          const gValue = cells.eq(1).text().trim();

          axios.get('https://www.shmu.sk/sk/?page=1&id=ran_sprav')
            .then(response => {
              const $ = cheerio.load(response.data);
              const table = $('table.w-small-width-max.center.dynamictable.stripped.mb-1').eq(0);
        
              const data = {
                'Bratislava': { k: ''},
                'Devín': { k: '', q: '' },
                'Komárno': { k: '', q: '' },
                'Medveďov': { k: '', q: '' },
                'Štúrovo': { k: '', q: '' },
                'Komárom': { k: ''},
                'Gönyû': { k: ''}
              };
        
              table.find('tr').each((i, row) => {
                const cells = $(row).find('td');
                const cellText = cells.eq(0).text().trim();
        
                if (cellText == 'Bratislava - Dunaj') {
                  data['Bratislava'].k = cells.eq(1).text().trim();
                } else if (cellText == 'Devín - Dunaj') {
                  data['Devín'].k= cells.eq(1).text().trim();
                  data['Devín'].q = cells.eq(3).text().trim();
                } else if (cellText == 'Komárno - Dunaj') {
                  data['Komárno'].k = cells.eq(1).text().trim();
                  data['Komárno'].q = cells.eq(3).text().trim();
                } else if (cellText == 'Medveďov - Dunaj') {
                  data['Medveďov'].k = cells.eq(1).text().trim();
                  data['Medveďov'].q = cells.eq(3).text().trim();
                } else if (cellText == 'Štúrovo - Dunaj') {
                  data['Štúrovo'].k = cells.eq(1).text().trim();
                  data['Štúrovo'].q = cells.eq(3).text().trim();
                }
              });
              data['Gönyû'].k = kValue;
              data['Komárom'].k = gValue;
              
        
              const date = new Date().toLocaleDateString('en-GB');
              const oldData = fs.existsSync(savePath) ? JSON.parse(fs.readFileSync(savePath, 'utf8')) : [];
        
              const newData = {
                date: date,
                data: Object.values(data)
              };
        
              const allData = [newData, ...oldData];
              fs.writeFileSync(savePath, JSON.stringify(allData, null, 2));
        
              const tableHtml = generateTableHtml(allData);
              fs.writeFileSync(tablePath, tableHtml);
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error =>{
          console.error(error);
        });
    })
    .catch(error => {
      axios.get('https://www.vizugy.hu/?mapModule=OpGrafikon&AllomasVOA=16495FDC-97AB-11D4-BB62-00508BA24287&mapData=OrasIdosor#mapData')
        .then(response => {
          const $ = cheerio.load(response.data);
          const table = $('#data');
    
          const data = [];
    
          const cells = table.find('tr').eq(1).find('td');
          const gValue = cells.eq(1).text().trim();

          axios.get('https://www.shmu.sk/sk/?page=1&id=ran_sprav')
            .then(response => {
              const $ = cheerio.load(response.data);
              const table = $('table.w-small-width-max.center.dynamictable.stripped.mb-1').eq(0);
        
              const data = {
                'Bratislava': { k: ''},
                'Devín': { k: '', q: '' },
                'Komárno': { k: '', q: '' },
                'Medveďov': { k: '', q: '' },
                'Štúrovo': { k: '', q: '' },
                'Komárom': { k: ''},
                'Gönyû': { k: ''}
              };
        
              table.find('tr').each((i, row) => {
                const cells = $(row).find('td');
                const cellText = cells.eq(0).text().trim();
        
                if (cellText == 'Bratislava - Dunaj') {
                  data['Bratislava'].k = cells.eq(1).text().trim();
                } else if (cellText == 'Devín - Dunaj') {
                  data['Devín'].k= cells.eq(1).text().trim();
                  data['Devín'].q = cells.eq(3).text().trim();
                } else if (cellText == 'Komárno - Dunaj') {
                  data['Komárno'].k = cells.eq(1).text().trim();
                  data['Komárno'].q = cells.eq(3).text().trim();
                } else if (cellText == 'Medveďov - Dunaj') {
                  data['Medveďov'].k = cells.eq(1).text().trim();
                  data['Medveďov'].q = cells.eq(3).text().trim();
                } else if (cellText == 'Štúrovo - Dunaj') {
                  data['Štúrovo'].k = cells.eq(1).text().trim();
                  data['Štúrovo'].q = cells.eq(3).text().trim();
                }
              });
              data['Gönyû'].k = "!";
              data['Komárom'].k = "!";
              
        
              const date = new Date().toLocaleDateString('en-GB');
              const oldData = fs.existsSync(savePath) ? JSON.parse(fs.readFileSync(savePath, 'utf8')) : [];
        
              const newData = {
                date: date,
                data: Object.values(data)
              };
        
              const allData = [newData, ...oldData];
              fs.writeFileSync(savePath, JSON.stringify(allData, null, 2));
        
              const tableHtml = generateTableHtml(allData);
              fs.writeFileSync(tablePath, tableHtml);
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error =>{
          axios.get('https://www.shmu.sk/sk/?page=1&id=ran_sprav')
            .then(response => {
              const $ = cheerio.load(response.data);
              const table = $('table.w-small-width-max.center.dynamictable.stripped.mb-1').eq(0);
        
              const data = {
                'Bratislava': { k: ''},
                'Devín': { k: '', q: '' },
                'Komárno': { k: '', q: '' },
                'Medveďov': { k: '', q: '' },
                'Štúrovo': { k: '', q: '' },
                'Komárom': { k: ''},
                'Gönyû': { k: ''}
              };
        
              table.find('tr').each((i, row) => {
                const cells = $(row).find('td');
                const cellText = cells.eq(0).text().trim();
        
                if (cellText == 'Bratislava - Dunaj') {
                  data['Bratislava'].k = cells.eq(1).text().trim();
                } else if (cellText == 'Devín - Dunaj') {
                  data['Devín'].k= cells.eq(1).text().trim();
                  data['Devín'].q = cells.eq(3).text().trim();
                } else if (cellText == 'Komárno - Dunaj') {
                  data['Komárno'].k = cells.eq(1).text().trim();
                  data['Komárno'].q = cells.eq(3).text().trim();
                } else if (cellText == 'Medveďov - Dunaj') {
                  data['Medveďov'].k = cells.eq(1).text().trim();
                  data['Medveďov'].q = cells.eq(3).text().trim();
                } else if (cellText == 'Štúrovo - Dunaj') {
                  data['Štúrovo'].k = cells.eq(1).text().trim();
                  data['Štúrovo'].q = cells.eq(3).text().trim();
                }
              });
              data['Gönyû'].k = "!";
              data['Komárom'].k = "!";
              
        
              const date = new Date().toLocaleDateString('en-GB');
              const oldData = fs.existsSync(savePath) ? JSON.parse(fs.readFileSync(savePath, 'utf8')) : [];
        
              const newData = {
                date: date,
                data: Object.values(data)
              };
        
              const allData = [newData, ...oldData];
              fs.writeFileSync(savePath, JSON.stringify(allData, null, 2));
        
              const tableHtml = generateTableHtml(allData);
              fs.writeFileSync(tablePath, tableHtml);
            })
            .catch(error => {
              console.error(error);
            });
        });
    });
  
  
}

function generateTableHtml(data) {
  let tableHtml = '<head>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>\n<body style="font-family:sans-serif;margin:0;overflow:hidden;width: 100%;height: 100vh;background-image: url(https://raw.githubusercontent.com/Martyn404/idk/main/bg.png);background-size: cover;background-position: center;">\n<div style="width: 100%; height: 100%; overflow: auto;">\n<table border="0" style="backdrop-filter: blur(2px);border-collapse:collapse;margin:0 auto;font-size:25px;background-color:rgba(255,255,255,0.3);text-align:center;">\n<thead>\n<tr>';

  // Add the city names as table headers
   tableHtml += '<th></th><th>Bratislava</th><th colspan="2">Devín</th><th colspan="2">Komárno</th><th colspan="2">Medveďov</th><th colspan="2">Štúrovo</th><th>Gönyû</th><th>Komárom</th>';

  tableHtml += '</tr>\n<tr>';

  // Add the H and Q labels under each city name
  tableHtml += '<th>Date</th>'
  tableHtml += '<th>H [cm]</th><th>H [cm]</th><th>Q [m3/s]</th><th>H [cm]</th><th>Q [m3/s]</th><th>H [cm]</th><th>Q [m3/s]</th><th>H [cm]</th><th>Q [m3/s]</th><th>H [cm]</th><th>H [cm]</th>'

  tableHtml += '</tr>\n</thead>\n<tbody>\n';

  // Loop through each data item
  data.forEach(item => {
    // Add the date as a row header
    tableHtml += `<tr><td>${item.date}</td>`;

    // Loop through each city's data
    item.data.forEach(cityData => {
      if(typeof cityData.q === 'undefined'){
        tableHtml += `<td>${cityData.k ? `${cityData.k}` : ''}</td>`;
      }
      else{
        tableHtml += `<td>${cityData.k ? `${cityData.k}` : ''}</td><td>${cityData.q ? `${cityData.q}` : ''}</td>`;
      }
    });

    tableHtml += '</tr>\n';
  });

  tableHtml += '</tbody>\n</table>\n</div>\n</body>';

  fs.writeFileSync('table.html', tableHtml); // Write generated HTML to file

  return tableHtml;
}
setInterval(() => {
  const now = new Date();
  if (now.getHours() === 9 - 2 && now.getMinutes() === 0 ) {
    // Read the HTML file
    const html = fs.readFileSync('table.html');
    const data = fs.readFileSync('save');

    const jsonData = JSON.parse(data);

    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    // Get the number of lines in the HTML
    const numLines = $.html().split('\n').length;

    // Check if there are at least 17 lines
    if (numLines >= 427) {
      // Get the HTML up to the 7th line from the end
      const newHTML = $.html().split('\n').slice(0, -7).join('\n');

      // Set the new HTML
      $('html').html(newHTML);

      // Write the updated HTML file
      fs.writeFileSync('table.html', $.html());

      jsonData.pop();

      // Write the updated JSON file
      fs.writeFileSync('save', JSON.stringify(jsonData, null, 2));
    }
    main();
  }
}, 60*1000);

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/table.html');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});