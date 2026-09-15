(() => {
  const form = document.getElementById('apiForm');
  const generateBtn = document.getElementById('generateBtn');
  const noteOutput = document.getElementById('noteOutput');
  const copyBtn = document.getElementById('copyBtn');
  if (!form || !generateBtn || !noteOutput || !copyBtn) return;

  const selected = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value || '';
  const val = (id) => document.getElementById(id)?.value.trim() || '';
  const yesNo = (v, yes, no) => v === 'Sim' ? yes : no;

  function buildPlainText() {
    const cnpj = val('cnpj');
    const access = selected('access');
    const sms = selected('sms');
    const linkedType = selected('linkedNumberType');
    const linkedUra = selected('linkedUra');
    const whatsapp = selected('whatsapp');
    const numberType = selected('numberType');
    const ura = selected('ura');
    const facebook = selected('facebook');
    const bm = selected('bm');
    const site = selected('site');
    const siteOwner = selected('siteOwner');
    const history = selected('history');
    const calls = selected('calls');
    const groups = selected('groups');
    const apiType = selected('apiType');
    const obs = val('observations');

    const lines = [
      'Dados da migração para a API Oficial',
      '',
      '1. DADOS DA EMPRESA',
      `• CNPJ: ${cnpj}`,
      '',
      '2. NÚMERO VINCULADO AO CNPJ',
      `• Acesso ao número: ${access}`,
      `• Recebe SMS e ligações: ${sms}`,
      `• Tipo: ${linkedType}`
    ];

    if (linkedType === 'Fixo') lines.push(`• URA / secretária eletrônica: ${linkedUra}`);

    lines.push(
      '',
      '3. NÚMERO A SER MIGRADO',
      `• Tipo: ${numberType}`,
      `• WhatsApp atual: ${whatsapp}`
    );

    if (numberType === 'Fixo') lines.push(`• URA / secretária eletrônica: ${ura}`);

    lines.push(
      '',
      '4. ESTRUTURA',
      `• Facebook: ${facebook}`,
      `• Possui BM: ${bm}`,
      `• Site: ${site}`
    );

    if (site === 'Não') lines.push(`• Criação do site: ${siteOwner}`);

    lines.push(
      '',
      '5. PONTOS IMPORTANTES PARA O CLIENTE',
      `• Histórico de conversas: ${yesNo(history, 'Sim, é importante', 'Não é importante')}`,
      `• Ligações: ${yesNo(calls, 'Sim, são importantes', 'Não são importantes')}`,
      `• Grupos de WhatsApp: ${yesNo(groups, 'Sim, são importantes', 'Não são importantes')}`,
      '',
      '6. MODALIDADE',
      `• ${apiType}`
    );

    if (obs) {
      lines.push('', '7. OBSERVAÇÕES', ...obs.split(/\r?\n/).map(line => `• ${line}`));
    }

    return lines.join('\n');
  }

  function renderNote(text) {
    const sections = text.split(/\n\n/);
    noteOutput.innerHTML = sections.map((section, index) => {
      const lines = section.split('\n');
      if (index === 0) return `<strong>${lines[0]}</strong>`;
      const title = lines.shift();
      return `<div class="note-section"><div class="note-section-title">${title}</div>${lines.map(line => `<div class="note-item">${line}</div>`).join('')}</div>`;
    }).join('');
  }

  generateBtn.addEventListener('click', () => {
    setTimeout(() => {
      const text = buildPlainText();
      window.__apiPlainText = text;
      renderNote(text);
    }, 0);
  });

  copyBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const text = window.__apiPlainText || buildPlainText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    const original = copyBtn.textContent;
    copyBtn.textContent = 'NOTA COPIADA';
    setTimeout(() => copyBtn.textContent = original, 1500);
  });
})();
