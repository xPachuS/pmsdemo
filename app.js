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
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

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
  saicaBlock.classList.toggle("hidden", tipoPersona.value !== "saica");
  externoBlock.classList.toggle("hidden", tipoPersona.value !== "externo");
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

  mejoraBlock.classList.remove("hidden");
  btnContinuar.disabled = true;

  // Solo bloquear visualmente
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

// ===== ENVÍO FORMULARIO FINAL con imágenes hasta 2MB =====
form.addEventListener("submit", e => {
  e.preventDefault();

  if (!propuesta.value.trim()) { alert("Debes describir la propuesta"); propuesta.focus(); return; }
  if (tipoPersona.value === "externo" && !emailRegex.test(emailExterno.value.trim())) { alert("Introduce un correo válido"); emailExterno.focus(); return; }

  // ===== VALIDAR ARCHIVOS =====
  for (let file of fotosAdjuntas.files) {
    if (!file.type.startsWith("image/")) { alert(`Archivo ${file.name} no es una imagen.`); return; }
    if (file.size > 2 * 1024 * 1024) { alert(`Archivo ${file.name} supera 2 MB.`); return; }
  }

  // ===== ENVIAR FORM =====
  if (fotosAdjuntas.files.length > 0) {
    const attachments = [];
    let loaded = 0;

    Array.from(fotosAdjuntas.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = evt => {
        attachments.push({ name: file.name, data: evt.target.result });
        loaded++;
        if (loaded === fotosAdjuntas.files.length) {
          form.dataset.attachments = JSON.stringify(attachments);
          sendFormWithAttachments(attachments);
        }
      };
      reader.readAsDataURL(file);
    });
  } else {
    sendFormWithAttachments();
  }
});

// ===== FUNCION PARA ENVIAR CON ATTACHMENTS =====
function sendFormWithAttachments(attachments = []) {
  // Creamos un objeto para EmailJS con todos los campos visibles + attachments
  const templateParams = {
    to_email: "peimadin@gmail.com",
    tipoPersona: tipoPersona.value,
    nombre: tipoPersona.value === "saica" ? nombreSaica.value : (anonimo.checked ? "Anónimo" : nombreExterno.value),
    correo: emailExterno.value,
    empresa: empresaSelect.value,
    pais: paisSelect.value,
    centro: centroSelect.value,
    lugarMejora: lugarMejora.value,
    otrosLugar: otrosLugar.value,
    propuesta: propuesta.value,
    attachments: attachments
  };

  // Enviar con EmailJS
  emailjs.send('service_o6s3ygm', 'template_6cynxub', templateParams)
    .then(() => {
      alert("Formulario enviado correctamente. ¡Gracias!");
      form.reset();
      location.reload();
    })
    .catch(err => {
      console.error("Error enviando el formulario:", err);
      alert("Error enviando el formulario, intenta nuevamente.");
    });
}
