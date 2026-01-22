const tipoPersona = document.getElementById("tipoPersona");
const saicaBlock = document.getElementById("saicaBlock");
const externoBlock = document.getElementById("externoBlock");

const empresaSelect = document.getElementById("empresaSelect");
const paisBlock = document.getElementById("paisBlock");
const paisSelect = document.getElementById("paisSelect");

const centroBlock = document.getElementById("centroBlock");
const centroSelect = document.getElementById("centroSelect");

const nombreSaicaBlock = document.getElementById("nombreSaicaBlock");
const nombreSaica = document.getElementById("nombreSaica");

const nombreExterno = document.getElementById("nombreExterno");
const anonimo = document.getElementById("anonimo");

let SAICA_DATA = {};

// Cargar JSON
fetch("saica.json")
  .then(response => response.json())
  .then(data => {
    SAICA_DATA = data;

    // Poblar select de empresas
    Object.entries(SAICA_DATA).forEach(([key, empresa]) => {
      empresaSelect.add(new Option(empresa.nombre, key));
    });
  })
  .catch(err => console.error("Error cargando JSON:", err));

// Tipo de persona
tipoPersona.addEventListener("change", () => {
  saicaBlock.classList.toggle("hidden", tipoPersona.value !== "saica");
  externoBlock.classList.toggle("hidden", tipoPersona.value !== "externo");
  nombreExterno.required = tipoPersona.value === "externo";
});

// Empresa seleccionada
empresaSelect.addEventListener("change", () => {
  // Reset bloques dependientes
  paisSelect.innerHTML = '<option value="">Selecciona un país</option>';
  centroSelect.innerHTML = '<option value="">Selecciona una planta</option>';
  paisBlock.classList.add("hidden");
  centroBlock.classList.add("hidden");
  nombreSaicaBlock.classList.add("hidden");
  nombreSaica.required = false;

  const empresa = SAICA_DATA[empresaSelect.value];
  if (!empresa) return;

  // Poblar países ordenados alfabéticamente
  Object.keys(empresa.paises)
    .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
    .forEach(pais => {
      paisSelect.add(new Option(pais, pais));
    });

  paisBlock.classList.remove("hidden");
});

// País seleccionado
paisSelect.addEventListener("change", () => {
  centroSelect.innerHTML = '<option value="">Selecciona una planta</option>';
  centroBlock.classList.add("hidden");
  nombreSaicaBlock.classList.add("hidden");
  nombreSaica.required = false;

  const empresa = SAICA_DATA[empresaSelect.value];
  const pais = paisSelect.value;
  if (!empresa || !pais) return;

  // Obtener plantas del país y ordenar alfabéticamente
  const plantas = [...empresa.paises[pais]].sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" })
  );

  plantas.forEach(centro => {
    centroSelect.add(new Option(centro, centro));
  });

  centroBlock.classList.remove("hidden");
});

// Planta seleccionada
centroSelect.addEventListener("change", () => {
  const mostrar = !!centroSelect.value;
  nombreSaicaBlock.classList.toggle("hidden", !mostrar);
  nombreSaica.required = mostrar;
});

// Externo - opción anónimo
anonimo.addEventListener("change", () => {
  nombreExterno.required = !anonimo.checked;
  if (anonimo.checked) nombreExterno.value = "";
});
