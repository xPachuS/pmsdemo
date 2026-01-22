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

// ===== REGEX EMAIL =====
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

  if (tipoPersona.value === "externo") {
    emailExterno.required = true;
    nombreExterno.required = !anonimo.checked;
  } else {
    emailExterno.required = false;
    emailExterno.value = "";
  }
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
    .sort((a,b) => a.localeCompare(b,"es"))
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
    .sort((a,b) => a.localeCompare(b,"es"))
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

// ===== BLOQUEO CAMPOS INICIALES =====
function bloquearDatosIniciales() {
  [
    tipoPersona,
    empresaSelect,
    paisSelect,
    centroSelect,
    nombreSaica,
    nombreExterno,
    emailExterno,
    anonimo
  ].forEach(el => el && (el.disabled = true));
}

// ===== CONTINUAR =====
btnContinuar.addEventListener("click", () => {
  if (!tipoPersona.value) { alert("Selecciona el tipo de persona"); return; }

  if (tipoPersona.value === "saica") {
    if (!empresaSelect.value || !paisSelect.value || !centroSelect.value || !nombreSaica.value) {
      alert("Completa todos los campos de Saica"); return;
    }
  }

  if (tipoPersona.value === "externo") {
    if (!emailRegex.test(emailExterno.value.trim())) {
      alert("Introduce un correo electrónico válido"); return;
    }
    if (!anonimo.checked && !nombreExterno.value) {
      alert("Introduce tu nombre o marca anónimo"); return;
    }
  }

  mejoraBlock.classList.remove("hidden");
  btnContinuar.disabled = true;
  bloquearDatosIniciales();
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
  propuestaBlock.classList.toggle("hidden", !otrosLugar.value.trim());
});

// ===== CONTADOR DE PROYECTO =====
propuesta.addEventListener("input", () => {
  const length = propuesta.value.length;
  contadorPropuesta.textContent = `${length} / 500`;
});

// ===== SUBIR FOTOS =====
const labelFotos = document.querySelector('label[for="fotosAdjuntas"]');
labelFotos && labelFotos.addEventListener("click", () => fotosAdjuntas.click());

// ===== ENVÍO CON EMAILJS =====
// Asegúrate de incluir el script de EmailJS y hacer emailjs.init('sWWKZZVhXL3sE1bp6');
form.addEventListener("submit", e => {
  e.preventDefault();

  // Validaciones
  if (!propuesta.value.trim()) { alert("Debes describir la propuesta"); propuesta.focus(); return; }
  if (tipoPersona.value === "externo" && !emailRegex.test(emailExterno.value.trim())) { alert("Introduce un correo válido"); emailExterno.focus(); return; }

  // Construir datos
  const data = {
    tipoPersona: tipoPersona.value,
    nombre: tipoPersona.value === 'saica' ? nombreSaica.value : (anonimo.checked ? "Anónimo" : nombreExterno.value),
    correo: emailExterno.value,
    empresa: empresaSelect.value,
    pais: paisSelect.value,
    centro: centroSelect.value,
    lugarMejora: lugarMejora.value,
    otrosLugar: otrosLugar.value,
    propuesta: propuesta.value
  };

  // Adjuntar fotos si existen
  const file = fotosAdjuntas.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      data.attachment = evt.target.result;
      enviarEmailJS(data);
    };
    reader.readAsDataURL(file);
  } else {
    enviarEmailJS(data);
  }
});

// ===== FUNCIÓN ENVIAR EMAIL =====
function enviarEmailJS(data) {
  emailjs.send('service_o6s3ygm', 'template_6cynxub', data)
    .then(() => {
      alert("Formulario enviado correctamente. ¡Gracias!");
      form.reset();
      location.reload();
    })
    .catch(err => {
      console.error(err);
      alert("Error enviando el formulario, intenta nuevamente.");
    });
}




