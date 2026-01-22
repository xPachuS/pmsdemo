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

tipoPersona.addEventListener("change", () => {
  saicaBlock.classList.toggle("hidden", tipoPersona.value !== "saica");
  externoBlock.classList.toggle("hidden", tipoPersona.value !== "externo");
  nombreExterno.required = tipoPersona.value === "externo";
});

empresaSelect.addEventListener("change", () => {
  centroSelect.innerHTML = '<option value="">Selecciona un centro</option>';
  centroBlock.classList.add("hidden");
  nombreSaicaBlock.classList.add("hidden");
  nombreSaica.required = false;

  const empresa = SAICA_DATA[empresaSelect.value];
  if (!empresa) return;

  // Aquí es donde ordenamos correctamente
  const centrosOrdenados = [...empresa.centros].sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" })
  );

  centrosOrdenados.forEach(centro => {
    centroSelect.add(new Option(centro, centro));
  });

  centroBlock.classList.remove("hidden");
});

centroSelect.addEventListener("change", () => {
  const mostrar = !!centroSelect.value;
  nombreSaicaBlock.classList.toggle("hidden", !mostrar);
  nombreSaica.required = mostrar;
});

anonimo.addEventListener("change", () => {
  nombreExterno.required = !anonimo.checked;
  if (anonimo.checked) nombreExterno.value = "";
});
