// Referencias al DOM
const tipoPersona = document.getElementById("tipoPersona");
const saicaBlock = document.getElementById("saicaBlock");
const externoBlock = document.getElementById("externoBlock");

const empresaSelect = document.getElementById("empresaSelect");
const centroBlock = document.getElementById("centroBlock");
const centroSelect = document.getElementById("centroSelect");

const nombreSaicaBlock = document.getElementById("nombreSaicaBlock");
const nombreSaica = document.getElementById("nombreSaica");

const nombreExterno = document.getElementById("nombreExterno");
const anonimo = document.getElementById("anonimo");

let SAICA_DATA = {};

// Cargar datos desde JSON
fetch("./data/saica.json")
  .then(res => res.json())
  .then(data => {
    SAICA_DATA = data;

    // Poblar select de empresas
    Object.entries(SAICA_DATA).forEach(([key, empresa]) => {
      empresaSelect.add(new Option(empresa.nombre, key));
    });
  })
  .catch(err => console.error("Error cargando datos:", err));

// Evento tipo de persona
tipoPersona.addEventListener("change", () => {
  saicaBlock.classList.toggle("hidden", tipoPersona.value !== "saica");
  externoBlock.classList.toggle("hidden", tipoPersona.value !== "externo");

  nombreExterno.required = tipoPersona.value === "externo";
});

// Evento empresa
empresaSelect.addEventListener("change", () => {
  centroSelect.innerHTML = '<option value="">Selecciona un centro</option>';
  centroBlock.classList.add("hidden");
  nombreSaicaBlock.classList.add("hidden");
  nombreSaica.required = false;

  const empresa = SAICA_DATA[empresaSelect.value];
  if (!empresa) return;

  // Ordenar centros alfabéticamente
  const centrosOrdenados = empresa.centros.slice().sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base' })
  );

  // Añadir centros al select
  centrosOrdenados.forEach(centro => {
    centroSelect.add(new Option(centro, centro));
  });

  centroBlock.classList.remove("hidden");
});

// Evento centro
centroSelect.addEventListener("change", () => {
  const mostrar = !!centroSelect.value;
  nombreSaicaBlock.classList.toggle("hidden", !mostrar);
  nombreSaica.required = mostrar;
});

// Evento opción anónimo
anonimo.addEventListener("change", () => {
  nombreExterno.required = !anonimo.checked;
  if (anonimo.checked) nombreExterno.value = "";
});
