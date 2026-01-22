// ===== ELEMENTOS =====
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

const btnContinuar = document.getElementById("btnContinuar");

const mejoraBlock = document.getElementById("mejoraBlock");
const lugarMejora = document.getElementById("lugarMejora");
const otrosBlock = document.getElementById("otrosBlock");
const otrosLugar = document.getElementById("otrosLugar");
const propuestaBlock = document.getElementById("propuestaBlock");
const propuesta = document.getElementById("propuesta");

let SAICA_DATA = {};

// ===== FORZAR MAYÚSCULAS =====
[nombreSaica, nombreExterno, otrosLugar].forEach(input => {
  if (!input) return;
  input.addEventListener("input", () => {
    input.value = input.value.toUpperCase();
  });
});

// ===== CARGAR JSON =====
fetch("saica.json")
  .then(res => res.json())
  .then(data => {
    SAICA_DATA = data;
    Object.entries(SAICA_DATA).forEach(([key, empresa]) => {
      empresaSelect.add(new Option(empresa.nombre, key));
    });
  })
  .catch(err => console.error("Error cargando JSON:", err));

// ===== TIPO DE PERSONA =====
tipoPersona.addEventListener("change", () => {
  saicaBlock.classList.toggle("hidden", tipoPersona.value !== "saica");
  externoBlock.classList.toggle("hidden", tipoPersona.value !== "externo");
  nombreExterno.required = tipoPersona.value === "externo" && !anonimo.checked;
});

// ===== EMPRESA =====
empresaSelect.addEventListener("change", () => {
  paisSelect.innerHTML = '<option value="">Selecciona un país</option>';
  centroSelect.innerHTML = '<option value="">Selecciona un centro</option>';

  paisBlock.classList.add("hidden");
  centroBlock.classList.add("hidden");
  nombreSaicaBlock.classList.add("hidden");

  const empresa = SAICA_DATA[empresaSelect.value];
  if (!empresa) return;

  Object.keys(empresa.paises)
    .sort((a, b) => a.localeCompare(b, "es"))
    .forEach(pais => paisSelect.add(new Option(pais, pais)));

  paisBlock.classList.remove("hidden");
});

// ===== PAÍS =====
paisSelect.addEventListener("change", () => {
  centroSelect.innerHTML = '<option value="">Selecciona un centro</option>';
  centroBlock.classList.add("hidden");
  nombreSaicaBlock.classList.add("hidden");

  const empresa = SAICA_DATA[empresaSelect.value];
  const pais = paisSelect.value;
  if (!empresa || !pais) return;

  empresa.paises[pais]
    .sort((a, b) => a.localeCompare(b, "es"))
    .forEach(centro => centroSelect.add(new Option(centro, centro)));

  centroBlock.classList.remove("hidden");
});

// ===== CENTRO =====
centroSelect.addEventListener("change", () => {
  const mostrar = !!centroSelect.value;
  nombreSaicaBlock.classList.toggle("hidden", !mostrar);
  nombreSaica.required = mostrar;
});

// ===== ANÓNIMO =====
anonimo.addEventListener("change", () => {
  nombreExterno.required = !anonimo.checked;
  if (anonimo.checked) nombreExterno.value = "";
});

// ===== CONTINUAR =====
btnContinuar.addEventListener("click", () => {
  // Validación básica
  if (!tipoPersona.value) {
    alert("Selecciona el tipo de persona");
    return;
  }

  if (tipoPersona.value === "saica") {
    if (!empresaSelect.value || !paisSelect.value || !centroSelect.value || !nombreSaica.value) {
      alert("Completa todos los campos de Saica");
      return;
    }
  }

  if (tipoPersona.value === "externo" && !anonimo.checked && !nombreExterno.value) {
    alert("Introduce tu nombre o marca anónimo");
    return;
  }

  mejoraBlock.classList.remove("hidden");
  btnContinuar.disabled = true;
});

// ===== LUGAR MEJORA =====
lugarMejora.addEventListener("change", () => {
  otrosBlock.classList.add("hidden");
  propuestaBlock.classList.add("hidden");
  otrosLugar.required = false;

  if (!lugarMejora.value) return;

  if (lugarMejora.value === "Otros") {
    otrosBlock.classList.remove("hidden");
    otrosLugar.required = true;
    return;
  }

  propuestaBlock.classList.remove("hidden");
});

// ===== OTROS =====
otrosLugar.addEventListener("input", () => {
  if (otrosLugar.value.trim()) {
    propuestaBlock.classList.remove("hidden");
  } else {
    propuestaBlock.classList.add("hidden");
  }
});
