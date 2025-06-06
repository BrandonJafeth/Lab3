/* ========== Referencias ========== */
const userForm         = document.getElementById('user-form');
const nameInput        = document.getElementById('username');
const emailInput       = document.getElementById('email');
const ageInput         = document.getElementById('age');

const nameError        = document.getElementById('name-error');
const emailError       = document.getElementById('email-error');
const ageError         = document.getElementById('age-error');

const usersContainer   = document.getElementById('users-container');
const noUsersMessage   = document.getElementById('no-users-message');
const userCount        = document.getElementById('user-count');

const dataVisualization = document.getElementById('data-visualization');
const jsonTab           = document.getElementById('json-tab');
const xmlTab            = document.getElementById('xml-tab');
const jsonContent       = document.getElementById('json-content');
const xmlContent        = document.getElementById('xml-content');
const jsonPreview       = document.getElementById('json-preview');
const xmlPreview        = document.getElementById('xml-preview');
const exportJsonBtn     = document.getElementById('export-json');
const exportXmlBtn      = document.getElementById('export-xml');
const copyJsonBtn       = document.getElementById('copy-json');
const copyXmlBtn        = document.getElementById('copy-xml');

/* ========== Datos ========== */
let users = [];

/* ========== Validación ========== */
function validateForm() {
  let valid = true;
  nameError.textContent  = '';
  emailError.textContent = '';
  ageError.textContent   = '';

  if (!nameInput.value.trim()) {
    nameError.textContent = 'El nombre es requerido';
    valid = false;
  }
  if (!emailInput.value.trim()) {
    emailError.textContent = 'El correo es requerido';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    emailError.textContent = 'El correo no es válido';
    valid = false;
  }
  if (!ageInput.value.trim()) {
    ageError.textContent = 'La edad es requerida';
    valid = false;
  } else if (+ageInput.value <= 0) {
    ageError.textContent = 'La edad debe ser un número positivo';
    valid = false;
  }
  return valid;
}

/* ========== CRUD usuarios ========== */
function addUser(e) {
  e.preventDefault();
  if (!validateForm()) return;

  users.push({
    id: crypto.randomUUID(),
    name:  nameInput.value.trim(),
    email: emailInput.value.trim(),
    age:   +ageInput.value
  });

  userForm.reset();
  renderUsers();
  updateDataVisualization();
  
  dataVisualization.style.opacity = '0';
  dataVisualization.classList.remove('hidden');
  setTimeout(() => {
    dataVisualization.style.opacity = '1';
    
    if (window.innerWidth <= 767) {
      const rect = dataVisualization.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + rect.top - 20,
        behavior: 'smooth'
      });
    }
  }, 10);
  
  nameInput.focus();
}

function removeUser(id) {
  users = users.filter(u => u.id !== id);
  renderUsers();
  updateDataVisualization();

  if (users.length === 0) {
    dataVisualization.style.opacity = '0';
    setTimeout(() => {
      dataVisualization.classList.add('hidden');
    }, 300);
  }
}

/* ========== Renderizado ========== */
function renderUsers() {
  userCount.textContent = users.length ? `(${users.length})` : '(0)';
  noUsersMessage.style.display = users.length ? 'none' : 'block';
  usersContainer.innerHTML = '';

  users.forEach(u => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <div class="user-info">
        <h2>${u.name}</h2>
        <p>${u.email}</p>
        <p>${u.age} años</p>
      </div>
      <button class="delete-btn" aria-label="Eliminar usuario"></button>`;

    card.querySelector('.delete-btn').onclick = () => removeUser(u.id);
    usersContainer.appendChild(card);
  });
}

/* ========== Generar JSON / XML ========== */
const generateJSON = () => JSON.stringify(users, null, 2);

function generateXML() {
  const t = (tag, val) => `    <${tag}>${val}</${tag}>\n`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<users>\n` +
         users.map(u => '  <user>\n' +
             t('name',  u.name ) +
             t('email', u.email) +
             t('age',   u.age  ) +
         '  </user>\n').join('') +
         '</users>';
}

/* ========== Vista previa & exportar ========== */
function updateDataVisualization() {
  jsonPreview.textContent = generateJSON();
  xmlPreview.textContent = generateXML();
}

function exportData(type) {
  const data = type === 'json' ? generateJSON() : generateXML();
  const blob = new Blob([data], {type: type === 'json' ? 'application/json' : 'application/xml'});
  const url  = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `usuarios.${type}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ========== Pestañas ========== */
function switchTab(showJson) {
  jsonTab.classList.toggle('active', showJson);
  xmlTab.classList.toggle('active', !showJson);
  jsonContent.classList.toggle('active', showJson);
  xmlContent.classList.toggle('active', !showJson);
}

/* ========== Eventos ========== */
userForm.onsubmit     = addUser;
jsonTab.onclick       = () => switchTab(true);
xmlTab.onclick        = () => switchTab(false);
exportJsonBtn.onclick = () => exportData('json');
exportXmlBtn.onclick  = () => exportData('xml');

/* ========== Funcionalidad de Copiar ========== */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      const notification = document.createElement('div');
      notification.className = 'copy-notification';
      notification.textContent = '¡Copiado!';
      document.body.appendChild(notification);
      
      
      const button = document.activeElement;
      if (button && button.classList.contains('copy-btn')) {
        const originalColor = button.style.backgroundColor;
        button.style.backgroundColor = '#04bdc6';
        setTimeout(() => {
          button.style.backgroundColor = originalColor;
        }, 300);
      }
      
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 1700);
    })
    .catch(err => {
      console.error('Error al copiar: ', err);
      
   n
      const notification = document.createElement('div');
      notification.className = 'copy-notification error';
      notification.textContent = 'Error al copiar';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 1700);
    });
}


copyJsonBtn.addEventListener('click', () => copyToClipboard(jsonPreview.textContent));
copyXmlBtn.addEventListener('click', () => copyToClipboard(xmlPreview.textContent));

/* ========== Estado inicial ========== */
renderUsers();
updateDataVisualization();


const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  
  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('focused');
  });
});  
window.addEventListener('resize', () => {
  if (users.length > 0 && !dataVisualization.classList.contains('hidden')) {
    updateDataVisualization();
  }
});


document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 100);
});

window.addEventListener('orientationchange', () => {

  setTimeout(() => {
    document.body.style.display = 'none';
    document.body.offsetHeight; 
    document.body.style.display = '';
    
    if (users.length > 0) {
      updateDataVisualization();
    }
  }, 200);
});


const resizeObserver = new ResizeObserver(entries => {
  if (entries[0].target === main) {
    document.body.style.minHeight = 
      window.innerHeight + 'px';
  }
});
resizeObserver.observe(document.querySelector('main'));