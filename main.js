const url = 'https://www.europeana.eu/api/v2/search.json?query=*&facet=PROVIDER&profile=facets&wskey=mg7Q6EMHj&rows=0';

const query = async (url) => await (await fetch(url, { headers: new Headers({ 'Accept': 'application/json' }) })).json();

const queryEuropeana = async () => {
  const json = await query(url);
  return json.facets[0].fields;
}

const national = [
  'Hispana',
  'Swedish Open Cultural Heritage | K-samsök',
  'Digitale Collectie',
  'Federacja Bibliotek Cyfrowych',
  'Arts Council Norway',
  'Deutsche Digitale Bibliothek',
  'Bibliothèque nationale de France'
];

function isNational(aggregator) {
  return national.includes(aggregator.label);
}

function draw(aggregators) {
  for (step = 1; step < 4; step++) {
    document.querySelector(`#title-${step}`).children[0].innerText = aggregators[step - 1].label;
    document.querySelector(`#title-${step}`).children[2].innerText = aggregators[step - 1].count;
    document.querySelector(`#silo-${step}`).style.height = 50 + aggregators[step - 1].scaled + 'px';
  }
}

queryEuropeana().then(data => {
  return data.filter(aggregator => {
    if (isNational(aggregator)) {
      return aggregator;
    }
  }).map(aggregator => {
    if (aggregator.label == 'Swedish Open Cultural Heritage | K-samsök') {
      aggregator.label = 'K-samsök'
    }
    
    return aggregator;
  });
}).then(stats => {
  return stats.map(aggregator => {
    aggregator.scaled = (aggregator.count - 1000000) / 7000;
    return aggregator;
  });
}).then(final => draw(final));
