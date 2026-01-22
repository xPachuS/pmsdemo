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
const emailExterno = document.getElementById("emailExterno");
const anonimo = document.getElementById("anonimo");

const btnContinuar = document.getElementById("btnContinuar");

const mejoraBlock = document.getElementById("mejoraBlock");
const lugarMejora = document.getElementById("lugarMejora");
const otrosBlock = document.getElementById("otrosBlock");
const otrosLugar = document.getElementById("otrosLugar");
const propuestaBlock = document.getElementById("propuestaBlock");
const propuesta = document.getElementById("propuesta");
const contadorPropuesta = document.getElementById("contadorPropuesta");
const fotosAdjuntas = document.getElementById("fotosAdjuntas");

const form = document.getElementById("formulario");

let SAICA_DATA = {};
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ===== FORZAR MAYÚSCULAS =====
[nombreSaica, nombreExterno, otrosLugar].forEach(input => {
  if (!input) return;
  input.addEventListener("input", () => input.value = input.value.toUpperCase());
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

// ===== EVENTOS =====
tipoPersona.addEventListener("change", () => {
  saicaBlock.classList.toggle("hidden", tipoPersona.value !== "Saica");
  externoBlock.classList.toggle("hidden", tipoPersona.value !== "Externo");
  emailExterno.required = tipoPersona.value === "externo";
  nombreExterno.required = tipoPersona.value === "externo" && !anonimo.checked;
});

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

centroSelect.addEventListener("change", () => {
  const mostrar = !!centroSelect.value;
  nombreSaicaBlock.classList.toggle("hidden", !mostrar);
  nombreSaica.required = mostrar;
});

anonimo.addEventListener("change", () => {
  nombreExterno.required = !anonimo.checked;
  if (anonimo.checked) nombreExterno.value = "";
});

btnContinuar.addEventListener("click", () => {
  if (!tipoPersona.value) { alert("Selecciona el tipo de persona"); return; }
  if (tipoPersona.value === "saica" && (!empresaSelect.value || !paisSelect.value || !centroSelect.value || !nombreSaica.value)) {
    alert("Completa todos los campos de Saica"); return;
  }
  if (tipoPersona.value === "externo" && (!emailRegex.test(emailExterno.value.trim()) || (!anonimo.checked && !nombreExterno.value))) {
    alert("Completa los campos de Externo correctamente"); return;
  }

  // ✅ Solo bloqueamos visualmente, NO deshabilitar
  mejoraBlock.classList.remove("hidden");
  btnContinuar.disabled = true;

  [tipoPersona, empresaSelect, paisSelect, centroSelect, nombreSaica, nombreExterno, emailExterno, anonimo].forEach(el => {
    el.style.pointerEvents = "none";
    el.style.opacity = "0.6";
  });
});

lugarMejora.addEventListener("change", () => {
  otrosBlock.classList.add("hidden");
  propuestaBlock.classList.add("hidden");
  otrosLugar.required = false;

  if (lugarMejora.value === "Otros") {
    otrosBlock.classList.remove("hidden");
    otrosLugar.required = true;
    return;
  }

  if (lugarMejora.value) propuestaBlock.classList.remove("hidden");
});

otrosLugar.addEventListener("input", () => {
  propuestaBlock.classList.toggle("hidden", !otrosLugar.value.trim());
});

propuesta.addEventListener("input", () => {
  contadorPropuesta.textContent = `${propuesta.value.length} / 500`;
});

document.querySelector('label[for="fotosAdjuntas"]').addEventListener("click", () => fotosAdjuntas.click());

// ===== INICIALIZAR EMAILJS =====
emailjs.init('paou8pXUBiwdx5WuH');

// ===== ENVÍO FORMULARIO FINAL con /send-form =====
form.addEventListener("submit", e => {
  e.preventDefault();

  if (!propuesta.value.trim()) {
    alert("Debes describir la propuesta");
    propuesta.focus();
    return;
  }

  if (tipoPersona.value === "externo" && !emailRegex.test(emailExterno.value.trim())) {
    alert("Introduce un correo válido");
    emailExterno.focus();
    return;
  }

  // ✅ Enviar TODO el form, todos los campos visibles serán leídos
  emailjs.sendForm('service_o6s3ygm', 'template_6cynxub', form)
    .then(() => {
      alert("Formulario enviado correctamente. ¡Gracias!");
      form.reset();
      location.reload();
    })
    .catch(err => {
      console.error("Error enviando el formulario:", err);
      alert("Error enviando el formulario, intenta nuevamente.");
    });
});





