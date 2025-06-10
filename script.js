document.addEventListener("DOMContentLoaded", () => {
  // all data
  const categorySelect = document.getElementById('category');
  const fromUnitSelect = document.getElementById('fromUnit');
  const toUnitSelect = document.getElementById('toUnit');
  const fromValueInput = document.getElementById('fromValue');
  const toValueInput = document.getElementById('toValue');
  const swapBtn = document.getElementById('swapBtn');
  const toggleThemeBtn = document.getElementById('toggleTheme');

  // base, coeficent
  const units = {
    distance: {
      'Metri': 1,
      'Kilometri': 1000,
      'Centimetri': 0.01,
      'Milimetri': 0.001,
      'Collas': 0.0254,
      'Pēdas': 0.3048,
      'Jūdzes': 1609.34,
      'Jardi': 0.9144,
      'Nanometri': 1e-9,
      'Mikrometri': 1e-6
    },
    temperature: {
      'Celsijs': {
        toK: c => c + 273.15,
        fromK: k => k - 273.15
      },
      'Fārenheiti': {
        toK: f => (f - 32) * 5 / 9 + 273.15,
        fromK: k => (k - 273.15) * 9 / 5 + 32
      },
      'Kelvins': {
        toK: k => k,
        fromK: k => k
      }
    },
    value: {
      'EUR': 1,
      'USD': 1.08,
      'GBP': 0.85,
      'JPY': 155.00,
      'SEK': 11.3,
      'CHF': 0.97,
      'AUD': 1.6,
      'CAD': 1.47,
      'CNY': 7.8
    },
    mass: {
      'Grami': 1,
      'Kilogrami': 0.001,
      'Mārciņas': 0.00220462,
      'Unces': 0.035274,
      'Tonnas': 1e-6
    },
    volume: {
      'Litri': 1,
      'Mililitri': 1000,
      'Kubliskie metri': 0.001,
      'Galoni': 0.264172,
      'Krūzes': 4.22675
    }
  };
  
  // fill date
  function populateUnits(category) {
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';
    const catUnits = units[category];
    for (const unit in catUnits) {
      fromUnitSelect.add(new Option(unit, unit));
      toUnitSelect.add(new Option(unit, unit));
    }
  }

  function convert() {
    const category = categorySelect.value;
    const fromValue = parseFloat(fromValueInput.value) || 0;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    // check null
    if (!fromUnit || !toUnit || !units[category]) return;

    if (category === 'temperature') {
      const kelvin = units.temperature[fromUnit].toK(fromValue);
      const result = units.temperature[toUnit].fromK(kelvin);
      toValueInput.value = result.toLocaleString(undefined, { maximumFractionDigits: 2 });
    } else {
      const fromFactor = units[category][fromUnit];
      const toFactor = units[category][toUnit];

      // check to incorect value
      if (!fromFactor || !toFactor) {
        toValueInput.value = 'Invalid unit';
        return;
      }

      // convert by koeficent
      const base = fromValue * fromFactor;
      const result = base / toFactor;
      toValueInput.value = result.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
  }

  // if swap category to 0
  categorySelect.addEventListener('change', () => {
    populateUnits(categorySelect.value);
    convert();
  });

  // change value, reconvert
  [fromUnitSelect, toUnitSelect].forEach(el =>
    el.addEventListener('change', convert)
  );

  // live converter
  fromValueInput.addEventListener('input', convert);

  // swap
  swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;

    const tempValue = fromValueInput.value;
    fromValueInput.value = '' + (parseFloat(toValueInput.value.replace(/,/g, '')) || 0);
    convert();
  });

  // css swap
  toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  // to defult
  populateUnits(categorySelect.value);
  convert();
});
