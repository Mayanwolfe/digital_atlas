document.getElementById('searchButton').addEventListener('click', () => {
  const countryName = document.getElementById('countryInput').value;
  fetchCountryData(countryName);
});

async function fetchCountryData(countryName) {
  const messageElement = document.getElementById('message');
  const resultsElement = document.getElementById('results');
  const flagElement = document.getElementById('flagContainer');
  const armsElement = document.getElementById('coatOfArmsContainer');

  messageElement.textContent = "";

  try {
      const response = await fetch(`/search?country=${countryName}`);
      const data = await response.json();

      if (data.length === 1) {
          resultsElement.style.display = 'block';
          displayCountryInfo(data[0], resultsElement);
      } else {
          flagElement.style.display = 'none';
          armsElement.style.display = 'none';
          displayCountryList(data, resultsElement);
      }
  } catch (error) {
    console.log(error)
    messageElement.textContent = "No result found. Please check your spelling and try again. This tool is built to search for the names of countries in English only.";
    resultsElement.style.display = 'none';
    flagElement.style.display = 'none';
    armsElement.style.display = 'none';
  }
}

function displayCountryInfo(countryData, container) {
  const flagElement = document.getElementById('flagContainer');
  const armsElement = document.getElementById('coatOfArmsContainer');
  const languages = Object.values(countryData.languages).join(', ');
  const demonym = countryData.demonyms?.eng ? `${countryData.demonyms.eng.m}` : 'Not available';
  const flagEmoji = countryData.flag;
  const flagUrl = countryData.flags.png;
  const flagAlt = countryData.flags.alt ? countryData.flags.alt : `Flag of ${countryData.name.common}`;
  const coatOfArmsUrl = countryData.coatOfArms.png;

  const currencyCode = Object.keys(countryData.currencies)[0];
  const currency = countryData.currencies[currencyCode];
  const currencyName = currency.name;
  const currencySymbol = currency.symbol;

  if (flagUrl) {
      flagElement.style.display = 'block';
  }
  if (coatOfArmsUrl) {
    armsElement.style.display = 'block';
  } 

    container.innerHTML = `
      <div class="country-name"> ${countryData.name.common} ${flagEmoji}</div>
      <div class="official-name">${countryData.name.official}</div>
      <p><strong>Capital:</strong> ${countryData.capital ? countryData.capital.join(', ') : 'Not available'}</p>
      <p><strong>Region:</strong> ${countryData.region}</p>
      <p><strong>Population:</strong> ${countryData.population.toLocaleString()}</p>
      <p><strong>Languages:</strong> ${languages}</p>
      <p><strong>Currency:</strong> ${currencyName} (${currencySymbol})</p>
      <p><strong>Demonym:</strong> ${demonym}</p>
      <p><strong>Independent:</strong> ${countryData.independent ? 'Yes' : 'No'}</p>
      <p><strong>UN Member:</strong> ${countryData.unMember ? 'Yes' : 'No'}</p>
      <p><strong>Google Map:</strong> <a href="${countryData.maps.googleMaps}">LINK</a></p>
  `;

    document.getElementById('flagContainer').innerHTML = flagUrl ? `<p><strong>Flag:</strong></p><img src="${flagUrl}" alt="${flagAlt}">` : '';
    document.getElementById('coatOfArmsContainer').innerHTML = coatOfArmsUrl ? `<p><strong>Coat of Arms:</strong></p><img src="${coatOfArmsUrl}" alt="Coat of Arms of ${countryData.name.common}">` : '';
}

function displayCountryList(countries, container) {
  let listHtml = `<p>Multiple results returned. Please choose one of the countries below to view:</p><ul>`;
  listHtml += countries.map(country => 
      `<li class="country-item" data-country="${country.name.common}">${country.name.common}</li>`
  ).join('');
  listHtml += `</ul>`;

  container.innerHTML = listHtml;
  //container.style.display = 'block';

  document.querySelectorAll('.country-item').forEach(item => {
      item.addEventListener('click', () => {
          const selectedCountry = countries.find(country => country.name.common === item.dataset.country);
          displayCountryInfo(selectedCountry, container);
      });
  });
}
