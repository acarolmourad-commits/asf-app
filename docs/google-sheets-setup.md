# Configuração Google Sheets - ASF App

## 📋 Passo a Passo

### 1. Criar a Planilha Google

1. Acesse: https://sheets.google.com
2. Crie uma nova planilha
3. Nomeie como: **"ASF - Dados do App"**

### 2. Criar as Abas

Crie estas abas na planilha:

**Aba 1: `manas_contatos`**
| A | B | C | D | E |
|---|---|---|---|---|
| Timestamp | Nome | WhatsApp | Cidade | Nível |

**Aba 2: `quiz_resultados`**
| A | B | C | D |
|---|---|---|---|
| Timestamp | Nome | Quiz | Pontuação |

**Aba 3: `surftrips_votos`**
| A | B | C | D |
|---|---|---|---|
| Timestamp | Pergunta | Resposta | Nome |

### 3. Configurar Google Apps Script

1. Na planilha, vá em **Extensões** → **Apps Script**
2. Delete o código padrão e cole o código abaixo:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    const type = data.type;
    const values = data.values;
    
    let targetSheet;
    
    if (type === 'manas_contato') {
      targetSheet = sheet.getSheetByName('manas_contatos');
      targetSheet.appendRow([
        new Date(),
        values.nome,
        values.whatsapp,
        values.cidade,
        values.nivel
      ]);
    } else if (type === 'quiz_resultado') {
      targetSheet = sheet.getSheetByName('quiz_resultados');
      targetSheet.appendRow([
        new Date(),
        values.nome,
        values.quiz,
        values.pontuacao
      ]);
    } else if (type === 'surftrips_voto') {
      targetSheet = sheet.getSheetByName('surftrips_votos');
      targetSheet.appendRow([
        new Date(),
        values.pergunta,
        values.resposta,
        values.nome || 'Anônimo'
      ]);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'online'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 4. Publicar o Script como Web App

1. Clique em **Implantar** → **Nova implantação**
2. Selecione **Web app**
3. Em "Executar como", escolha: **Você**
4. Em "Quem tem acesso", escolha: **Qualquer pessoa**
5. Clique em **Implantar**
6. **Copie a URL** gerada (termina com `/exec`)

### 5. Adicionar a URL ao App

Me envie a URL que eu configuro o app para enviar os dados para lá!

---

## 📊 Como Acessar os Dados

1. Acesse a planilha: https://sheets.google.com
2. Abra a planilha "ASF - Dados do App"
3. Os dados aparecem em tempo real!

### Exemplos de Análises:

- **Manas cadastradas:** Total por cidade
- **Quizzes mais populares:** Qual quiz tem mais respostas
- **Destinos preferidos:** Onde as manas querem surfar

---

## 🔒 Segurança

- Os dados ficam na SUA conta Google
- Só você tem acesso
- Backup automático do Google
- Grátis para sempre